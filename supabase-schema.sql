-- Execute este SQL no dashboard do Supabase (SQL Editor)

-- Criar tabela User
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Criar tabela Account
CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- Criar tabela Session
CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Criar tabela VerificationToken
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

-- Criar tabela SuperPixel
CREATE TABLE IF NOT EXISTS "SuperPixel" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SuperPixel_pkey" PRIMARY KEY ("id")
);

-- Criar tabela Pixel
CREATE TABLE IF NOT EXISTS "Pixel" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "pixelId" TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "superPixelId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Pixel_pkey" PRIMARY KEY ("id")
);

-- Criar tabela Event
CREATE TABLE IF NOT EXISTS "Event" (
  "id" TEXT NOT NULL,
  "eventName" TEXT NOT NULL,
  "eventData" TEXT NOT NULL,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "superPixelId" TEXT NOT NULL,
  "processed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- Criar tabela TrackingSession
CREATE TABLE IF NOT EXISTS "TrackingSession" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "superPixelId" TEXT NOT NULL,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endTime" TIMESTAMP(3),
  "pageViews" INTEGER NOT NULL DEFAULT 0,
  "events" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "TrackingSession_pkey" PRIMARY KEY ("id")
);

-- Criar índices únicos
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX IF NOT EXISTS "TrackingSession_sessionId_key" ON "TrackingSession"("sessionId");

-- Criar foreign keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SuperPixel" ADD CONSTRAINT "SuperPixel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Pixel" ADD CONSTRAINT "Pixel_superPixelId_fkey" FOREIGN KEY ("superPixelId") REFERENCES "SuperPixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_superPixelId_fkey" FOREIGN KEY ("superPixelId") REFERENCES "SuperPixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrackingSession" ADD CONSTRAINT "TrackingSession_superPixelId_fkey" FOREIGN KEY ("superPixelId") REFERENCES "SuperPixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Inserir usuário admin
INSERT INTO "User" ("id", "name", "email", "password", "createdAt", "updatedAt")
VALUES (
  'cmbxzg14k000ertbpic1trvsx',
  'Admin',
  'admin@superpixel.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', -- senha: admin123
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Inserir Super Pixel de exemplo
INSERT INTO "SuperPixel" ("id", "name", "description", "isActive", "userId", "createdAt", "updatedAt")
VALUES (
  'cmbxzg14k000frtbpic1trvsx',
  'MODARE',
  'Super Pixel principal para testes',
  true,
  'cmbxzg14k000ertbpic1trvsx',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;

-- Inserir Pixels de exemplo
INSERT INTO "Pixel" ("id", "name", "pixelId", "accessToken", "isActive", "superPixelId", "createdAt", "updatedAt")
VALUES 
(
  'cmbxzg14k000grtbpic1trvsx',
  'Pixel Principal',
  '123456789012345',
  'token-principal-123',
  true,
  'cmbxzg14k000frtbpic1trvsx',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'cmbxzg14k000hrtbpic1trvsx',
  'Pixel Backup',
  '987654321098765',
  'token-backup-456',
  true,
  'cmbxzg14k000frtbpic1trvsx',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING; 