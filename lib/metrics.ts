import client from "prom-client";

declare global {
  var __mintpay_metrics_registry__: client.Registry | undefined;
  var __mintpay_http_request_duration__:
    | client.Histogram<"method" | "route" | "status">
    | undefined;
}

const register =
  global.__mintpay_metrics_registry__ ??
  (() => {
    const r = new client.Registry();
    r.setDefaultLabels({ app: "mintpay" });
    client.collectDefaultMetrics({ register: r, prefix: "mintpay_" });
    global.__mintpay_metrics_registry__ = r;
    return r;
  })();

const httpRequestDuration =
  global.__mintpay_http_request_duration__ ??
  new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status"],
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    registers: [register],
  });

global.__mintpay_http_request_duration__ = httpRequestDuration;

export { httpRequestDuration };

export { register };