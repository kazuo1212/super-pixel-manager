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

-- Adicionar colunas que podem estar faltando
DO $$
BEGIN
    -- Verificar e adicionar colunas na tabela SuperPixel
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SuperPixel' AND column_name = 'isActive') THEN
        ALTER TABLE "SuperPixel" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
        RAISE NOTICE 'Coluna isActive adicionada à tabela SuperPixel';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SuperPixel' AND column_name = 'description') THEN
        ALTER TABLE "SuperPixel" ADD COLUMN "description" TEXT;
        RAISE NOTICE 'Coluna description adicionada à tabela SuperPixel';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SuperPixel' AND column_name = 'createdAt') THEN
        ALTER TABLE "SuperPixel" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Coluna createdAt adicionada à tabela SuperPixel';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SuperPixel' AND column_name = 'updatedAt') THEN
        ALTER TABLE "SuperPixel" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Coluna updatedAt adicionada à tabela SuperPixel';
    END IF;

    -- Verificar e adicionar colunas na tabela Pixel
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Pixel' AND column_name = 'isActive') THEN
        ALTER TABLE "Pixel" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
        RAISE NOTICE 'Coluna isActive adicionada à tabela Pixel';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Pixel' AND column_name = 'superPixelId') THEN
        ALTER TABLE "Pixel" ADD COLUMN "superPixelId" TEXT NOT NULL DEFAULT 'temp-id';
        RAISE NOTICE 'Coluna superPixelId adicionada à tabela Pixel';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Pixel' AND column_name = 'createdAt') THEN
        ALTER TABLE "Pixel" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Coluna createdAt adicionada à tabela Pixel';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Pixel' AND column_name = 'updatedAt') THEN
        ALTER TABLE "Pixel" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Coluna updatedAt adicionada à tabela Pixel';
    END IF;

    -- Verificar e adicionar colunas na tabela Event
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Event' AND column_name = 'superPixelId') THEN
        ALTER TABLE "Event" ADD COLUMN "superPixelId" TEXT NOT NULL DEFAULT 'temp-id';
        RAISE NOTICE 'Coluna superPixelId adicionada à tabela Event';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Event' AND column_name = 'processed') THEN
        ALTER TABLE "Event" ADD COLUMN "processed" BOOLEAN NOT NULL DEFAULT false;
        RAISE NOTICE 'Coluna processed adicionada à tabela Event';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Event' AND column_name = 'timestamp') THEN
        ALTER TABLE "Event" ADD COLUMN "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Coluna timestamp adicionada à tabela Event';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Event' AND column_name = 'createdAt') THEN
        ALTER TABLE "Event" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Coluna createdAt adicionada à tabela Event';
    END IF;

    -- Verificar e adicionar colunas na tabela TrackingSession
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'TrackingSession' AND column_name = 'superPixelId') THEN
        ALTER TABLE "TrackingSession" ADD COLUMN "superPixelId" TEXT NOT NULL DEFAULT 'temp-id';
        RAISE NOTICE 'Coluna superPixelId adicionada à tabela TrackingSession';
    END IF;

    -- Verificar e adicionar colunas na tabela User
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'password') THEN
        ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'temp-password';
        RAISE NOTICE 'Coluna password adicionada à tabela User';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'createdAt') THEN
        ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Coluna createdAt adicionada à tabela User';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'updatedAt') THEN
        ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Coluna updatedAt adicionada à tabela User';
    END IF;
END $$;

-- Criar índices únicos
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX IF NOT EXISTS "TrackingSession_sessionId_key" ON "TrackingSession"("sessionId");

-- Adicionar foreign keys apenas se não existirem E se as colunas existirem
DO $$
BEGIN
    -- Account_userId_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Account_userId_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'userId') THEN
            ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            RAISE NOTICE 'Foreign key Account_userId_fkey criada';
        END IF;
    END IF;
    
    -- Session_userId_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Session_userId_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Session' AND column_name = 'userId') THEN
            ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            RAISE NOTICE 'Foreign key Session_userId_fkey criada';
        END IF;
    END IF;
    
    -- SuperPixel_userId_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SuperPixel_userId_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SuperPixel' AND column_name = 'userId') THEN
            ALTER TABLE "SuperPixel" ADD CONSTRAINT "SuperPixel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            RAISE NOTICE 'Foreign key SuperPixel_userId_fkey criada';
        END IF;
    END IF;
    
    -- Pixel_superPixelId_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Pixel_superPixelId_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pixel' AND column_name = 'superPixelId') THEN
            ALTER TABLE "Pixel" ADD CONSTRAINT "Pixel_superPixelId_fkey" FOREIGN KEY ("superPixelId") REFERENCES "SuperPixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            RAISE NOTICE 'Foreign key Pixel_superPixelId_fkey criada';
        END IF;
    END IF;
    
    -- Event_superPixelId_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Event_superPixelId_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Event' AND column_name = 'superPixelId') THEN
            ALTER TABLE "Event" ADD CONSTRAINT "Event_superPixelId_fkey" FOREIGN KEY ("superPixelId") REFERENCES "SuperPixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            RAISE NOTICE 'Foreign key Event_superPixelId_fkey criada';
        END IF;
    END IF;
    
    -- TrackingSession_superPixelId_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrackingSession_superPixelId_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TrackingSession' AND column_name = 'superPixelId') THEN
            ALTER TABLE "TrackingSession" ADD CONSTRAINT "TrackingSession_superPixelId_fkey" FOREIGN KEY ("superPixelId") REFERENCES "SuperPixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            RAISE NOTICE 'Foreign key TrackingSession_superPixelId_fkey criada';
        END IF;
    END IF;
END $$;

-- PRIMEIRO: Inserir usuário admin (garantir que existe)
INSERT INTO "User" ("id", "name", "email", "password", "createdAt", "updatedAt")
VALUES (
  'cmbxzg14k000ertbpic1trvsx',
  'Admin',
  'admin@superpixel.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', -- senha: admin123
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO UPDATE SET
  "name" = EXCLUDED."name",
  "password" = EXCLUDED."password",
  "updatedAt" = CURRENT_TIMESTAMP;

-- SEGUNDO: Inserir Super Pixel (só depois que o usuário existe)
INSERT INTO "SuperPixel" ("id", "name", "description", "isActive", "userId", "createdAt", "updatedAt")
SELECT 
  'cmbxzg14k000frtbpic1trvsx',
  'MODARE',
  'Super Pixel principal para testes',
  true,
  'cmbxzg14k000ertbpic1trvsx',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "User" WHERE "id" = 'cmbxzg14k000ertbpic1trvsx')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;

-- TERCEIRO: Inserir Pixels (só depois que o SuperPixel existe)
INSERT INTO "Pixel" ("id", "name", "pixelId", "accessToken", "isActive", "superPixelId", "createdAt", "updatedAt")
SELECT * FROM (VALUES 
  ('cmbxzg14k000grtbpic1trvsx', 'Pixel Principal', '123456789012345', 'token-principal-123', true, 'cmbxzg14k000frtbpic1trvsx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmbxzg14k000hrtbpic1trvsx', 'Pixel Backup', '987654321098765', 'token-backup-456', true, 'cmbxzg14k000frtbpic1trvsx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v("id", "name", "pixelId", "accessToken", "isActive", "superPixelId", "createdAt", "updatedAt")
WHERE EXISTS (SELECT 1 FROM "SuperPixel" WHERE "id" = 'cmbxzg14k000frtbpic1trvsx')
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "pixelId" = EXCLUDED."pixelId",
  "accessToken" = EXCLUDED."accessToken",
  "updatedAt" = CURRENT_TIMESTAMP;

-- Verificar se tudo foi criado corretamente
SELECT 'Usuários criados:' as info, COUNT(*) as count FROM "User";
SELECT 'SuperPixels criados:' as info, COUNT(*) as count FROM "SuperPixel";
SELECT 'Pixels criados:' as info, COUNT(*) as count FROM "Pixel";

-- Mostrar estrutura das tabelas para debug
SELECT 'Colunas da tabela SuperPixel:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'SuperPixel' 
ORDER BY ordinal_position;

SELECT 'Colunas da tabela Event:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Event' 
ORDER BY ordinal_position; 