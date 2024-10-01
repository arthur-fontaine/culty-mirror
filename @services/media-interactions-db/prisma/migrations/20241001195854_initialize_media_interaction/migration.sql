-- CreateTable
CREATE TABLE "MediaInteraction" (
    "id" SERIAL NOT NULL,
    "mediaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "bookmark" BOOLEAN NOT NULL DEFAULT false,
    "consumed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MediaInteraction_pkey" PRIMARY KEY ("id")
);
