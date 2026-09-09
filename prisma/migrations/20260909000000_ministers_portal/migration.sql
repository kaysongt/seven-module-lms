-- CreateEnum
CREATE TYPE "MinisterStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "MinisterProfile" (
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "church" TEXT NOT NULL,
    "ministryRole" TEXT NOT NULL,
    "requestNote" TEXT NOT NULL,
    "status" "MinisterStatus" NOT NULL DEFAULT 'PENDING',
    "clearance" INTEGER NOT NULL DEFAULT 0,
    "adminNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinisterProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "MinistryFile" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "clearance" INTEGER NOT NULL DEFAULT 1,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "uploadedById" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinistryFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinistryFileContent" (
    "fileId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "MinistryFileContent_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "MinistryRequestLimit" (
    "key" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinistryRequestLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "MinisterProfile_status_createdAt_idx" ON "MinisterProfile"("status", "createdAt");

-- CreateIndex
CREATE INDEX "MinistryFile_status_clearance_createdAt_idx" ON "MinistryFile"("status", "clearance", "createdAt");

-- CreateIndex
CREATE INDEX "MinistryRequestLimit_expiresAt_idx" ON "MinistryRequestLimit"("expiresAt");

-- AddForeignKey
ALTER TABLE "MinisterProfile" ADD CONSTRAINT "MinisterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisterProfile" ADD CONSTRAINT "MinisterProfile_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinistryFile" ADD CONSTRAINT "MinistryFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinistryFileContent" ADD CONSTRAINT "MinistryFileContent_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "MinistryFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Enforce approval and valid clearance even outside application code.
ALTER TABLE "MinisterProfile" ADD CONSTRAINT "MinisterProfile_approval_clearance_check" CHECK (("status" = 'APPROVED' AND "clearance" BETWEEN 1 AND 3) OR ("status" <> 'APPROVED' AND "clearance" = 0));
ALTER TABLE "MinistryFile" ADD CONSTRAINT "MinistryFile_clearance_check" CHECK ("clearance" BETWEEN 1 AND 3);
ALTER TABLE "MinistryFile" ADD CONSTRAINT "MinistryFile_size_check" CHECK ("byteSize" > 0 AND "byteSize" <= 3145728);
