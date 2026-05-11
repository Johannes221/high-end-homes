#!/usr/bin/env node

const { execSync } = require('child_process')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function syncDatabase() {
  try {
    console.log('Syncing database schema...')
    execSync('npx prisma db push', { stdio: 'inherit' })
    console.log('Database schema synced successfully')
  } catch (error) {
    console.error('Failed to sync database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

syncDatabase()
