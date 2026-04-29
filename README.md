# MintPay

MintPay is a seamless and secure digital payments platform that allows users to
send and receive money, track expenses, apply for loans, and manage their Mint
Wallet for hassle-free transactions.

## Features

### 💸 Payments

- **Send Money**: Instantly transfer money to other MintPay users.
- **Request Money**: Request payments from friends, family, or clients.

### 📊 Expense Tracking

- **Transaction History**: View a detailed record of all your transactions.
- **Spending Insights**: Get insights into your spending habits with categorized
  reports.

### 🏦 Loan Applications

- **Apply for Loans**: Seamlessly apply for short-term loans through the
  platform.
- **Loan Status Tracking**: Monitor the status of your loan applications in real
  time.

### 💳 Mint Wallet

- **Add Money**: Top up your Mint Wallet for quick, pinless transactions.
- **Withdraw Funds**: Transfer money from your Mint Wallet to your linked bank
  account.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma
- **Database**: PostgreSQL
- **Authentication**: Auth.js

## Installation & Setup

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database setup

### Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mintpay.git
cd mintpay
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env
```

Fill in the necessary credentials in the .env file.

1. Run the development server:

```bash
npm run dev
```

1. Open your browser and navigate to <http://localhost:3000>

## Monitoring (Prometheus + Grafana)

MintPay exposes Prometheus metrics at `/api/metrics`.

### Start Monitoring Stack

1. Start your app first:

```bash
npm run dev
```

1. Start Prometheus and Grafana:

```bash
npm run monitoring:up
```

1. Open:

- Prometheus: <http://localhost:9090>
- Grafana: <http://localhost:3001>

Grafana default credentials:

- Username: `admin`
- Password: `admin`

Prometheus is pre-configured to scrape:

- <http://host.docker.internal:3000/api/metrics>

Grafana auto-provisions:

- Prometheus data source
- Dashboard: MintPay / MintPay Overview

### Useful Commands

```bash
npm run monitoring:logs
npm run monitoring:down
```

Contributing

We welcome contributions! Feel free to submit issues and pull requests to
enhance MintPay.
