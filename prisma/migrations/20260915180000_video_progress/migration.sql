CREATE TABLE "VideoProgress" (
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "watchedSeconds" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetSeconds" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sessionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "heartbeatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "VideoProgress_pkey" PRIMARY KEY ("userId", "lessonId"),
    CONSTRAINT "VideoProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VideoProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "VideoProgress_lessonId_idx" ON "VideoProgress"("lessonId");
