-- CreateTable
CREATE TABLE "AppState" (
    "id" TEXT NOT NULL,
    "singletonKey" TEXT NOT NULL,
    "lastNotificationSentAt" TIMESTAMP(3),

    CONSTRAINT "AppState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppState_singletonKey_key" ON "AppState"("singletonKey");
