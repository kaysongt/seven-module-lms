-- CreateTable
CREATE TABLE "FinalExam" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL DEFAULT 3600,
    "passMark" INTEGER NOT NULL DEFAULT 70,
    "questions" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalExamRegistration" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "church" TEXT NOT NULL DEFAULT '',
    "localApproved" BOOLEAN NOT NULL DEFAULT false,
    "attemptsAllowed" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalExamRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalExamAttempt" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "questions" JSONB NOT NULL,
    "passMark" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "scorePct" INTEGER,
    "correct" INTEGER,
    "moduleResults" JSONB,

    CONSTRAINT "FinalExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinalExam_programId_key" ON "FinalExam"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalExamRegistration_examId_userId_key" ON "FinalExamRegistration"("examId", "userId");

-- CreateIndex
CREATE INDEX "FinalExamAttempt_submittedAt_expiresAt_idx" ON "FinalExamAttempt"("submittedAt", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "FinalExamAttempt_registrationId_number_key" ON "FinalExamAttempt"("registrationId", "number");

-- AddForeignKey
ALTER TABLE "FinalExam" ADD CONSTRAINT "FinalExam_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalExamRegistration" ADD CONSTRAINT "FinalExamRegistration_examId_fkey" FOREIGN KEY ("examId") REFERENCES "FinalExam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalExamRegistration" ADD CONSTRAINT "FinalExamRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalExamAttempt" ADD CONSTRAINT "FinalExamAttempt_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "FinalExamRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
