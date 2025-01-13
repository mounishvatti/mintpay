-- CreateTable
CREATE TABLE "userbankdetails" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "upiid" VARCHAR(255) NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userbankdetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "from_upi_id" VARCHAR(255) NOT NULL,
    "to_upi_id" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userbankdetails_username_key" ON "userbankdetails"("username");

-- CreateIndex
CREATE UNIQUE INDEX "userbankdetails_email_key" ON "userbankdetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userbankdetails_upiid_key" ON "userbankdetails"("upiid");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "userbankdetails" ADD CONSTRAINT "userbankdetails_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_from_upi_id_fkey" FOREIGN KEY ("from_upi_id") REFERENCES "userbankdetails"("upiid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_to_upi_id_fkey" FOREIGN KEY ("to_upi_id") REFERENCES "userbankdetails"("upiid") ON DELETE RESTRICT ON UPDATE CASCADE;
