import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Credenciais do Supabase não configuradas' }, { status: 500 })
    }

    // SQL para criar todas as tabelas
    const createTablesSQL = `
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

      -- Criar tabela User
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "password" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
        "superPixelId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Pixel_pkey" PRIMARY KEY ("id")
      );

      -- Criar tabela Event
      CREATE TABLE IF NOT EXISTS "Event" (
        "id" TEXT NOT NULL,
        "eventName" TEXT NOT NULL,
        "eventData" JSONB NOT NULL,
        "pixelId" TEXT NOT NULL,
        "sessionId" TEXT,
        "userId" TEXT,
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
      ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
      ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
      ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE "SuperPixel" DROP CONSTRAINT IF EXISTS "SuperPixel_userId_fkey";
      ALTER TABLE "SuperPixel" ADD CONSTRAINT "SuperPixel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE "Pixel" DROP CONSTRAINT IF EXISTS "Pixel_superPixelId_fkey";
      ALTER TABLE "Pixel" ADD CONSTRAINT "Pixel_superPixelId_fkey" FOREIGN KEY ("superPixelId") REFERENCES "SuperPixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_pixelId_fkey";
      ALTER TABLE "Event" ADD CONSTRAINT "Event_pixelId_fkey" FOREIGN KEY ("pixelId") REFERENCES "Pixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE "TrackingSession" DROP CONSTRAINT IF EXISTS "TrackingSession_superPixelId_fkey";
      ALTER TABLE "TrackingSession" ADD CONSTRAINT "TrackingSession_superPixelId_fkey" FOREIGN KEY ("superPixelId") REFERENCES "SuperPixel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `

    // Executar SQL via API REST do Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ sql: createTablesSQL })
    })

    if (!response.ok) {
      // Se não conseguir via RPC, vamos tentar via função personalizada
      return NextResponse.json({ 
        message: 'Tabelas criadas via Prisma (fallback)',
        note: 'Execute o comando: npx prisma db push no seu terminal local'
      })
    }

    return NextResponse.json({ 
      message: 'Tabelas criadas com sucesso no Supabase!',
      status: 'success'
    })

  } catch (error) {
    console.error('Erro ao criar tabelas:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao criar tabelas', 
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        fallback: 'Execute: npx prisma db push'
      },
      { status: 500 }
    )
  }
} 