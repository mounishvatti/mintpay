import type { NextApiRequest, NextApiResponse } from "next";
import { register, httpRequestDuration } from "@/lib/metrics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const start = process.hrtime.bigint();

  if (req.method !== "GET") {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1_000_000_000;
    httpRequestDuration
      .labels(req.method ?? "UNKNOWN", "/api/metrics", "405")
      .observe(durationSeconds);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    res.setHeader("Content-Type", register.contentType);
    const metrics = await register.metrics();
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1_000_000_000;
    httpRequestDuration
      .labels(req.method, "/api/metrics", "200")
      .observe(durationSeconds);
    return res.status(200).send(metrics);
  } catch {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1_000_000_000;
    httpRequestDuration
      .labels(req.method, "/api/metrics", "500")
      .observe(durationSeconds);
    return res.status(500).json({ message: "Failed to collect metrics" });
  }
}
