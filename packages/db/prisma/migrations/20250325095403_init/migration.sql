-- CreateEnum
CREATE TYPE "ValidatorStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validators" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "ipLocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "validators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticks" (
    "id" TEXT NOT NULL,
    "status" "ValidatorStatus" NOT NULL,
    "latency" DOUBLE PRECISION NOT NULL,
    "validatorId" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_validatorsTowebsites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_validatorsTowebsites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_validatorsTowebsites_B_index" ON "_validatorsTowebsites"("B");

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticks" ADD CONSTRAINT "ticks_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "validators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticks" ADD CONSTRAINT "ticks_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_validatorsTowebsites" ADD CONSTRAINT "_validatorsTowebsites_A_fkey" FOREIGN KEY ("A") REFERENCES "validators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_validatorsTowebsites" ADD CONSTRAINT "_validatorsTowebsites_B_fkey" FOREIGN KEY ("B") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
