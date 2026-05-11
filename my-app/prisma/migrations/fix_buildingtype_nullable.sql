-- Migration: Make buildingType nullable
-- This fixes the NOT NULL constraint error

-- SQLite doesn't support ALTER COLUMN directly, so we need to:
-- 1. Create a new table with the correct schema
-- 2. Copy data
-- 3. Drop old table
-- 4. Rename new table

-- Create new table with nullable buildingType
CREATE TABLE QuoteRequest_new (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  squareMeters INTEGER NOT NULL,
  buildingType TEXT,  -- Changed from NOT NULL to nullable
  constructionYear TEXT,
  floor TEXT,
  elevator TEXT,
  materialsJson TEXT NOT NULL,
  removalItemsJson TEXT NOT NULL,
  quantityEstimate TEXT,
  valuables TEXT,
  asbestosRequired INTEGER NOT NULL DEFAULT 0,
  otherPollutants INTEGER NOT NULL DEFAULT 0,
  disposalWanted INTEGER NOT NULL DEFAULT 0,
  permitStatus TEXT,
  desiredDate TEXT,
  imageFileNamesJson TEXT NOT NULL,
  imagesBase64Json TEXT NOT NULL DEFAULT '[]',
  notes TEXT,
  complexityScore INTEGER NOT NULL,
  complexityLevel TEXT NOT NULL,
  effortRange TEXT NOT NULL,
  complexityFlagsJson TEXT NOT NULL,
  estimatedMinPrice INTEGER NOT NULL,
  estimatedMaxPrice INTEGER NOT NULL,
  approvalStatus TEXT NOT NULL DEFAULT 'pending',
  approvedAt TEXT,
  approvedBy TEXT,
  sharedAt TEXT,
  payloadJson TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL
);

-- Copy existing data
INSERT INTO QuoteRequest_new SELECT * FROM QuoteRequest;

-- Drop old table
DROP TABLE QuoteRequest;

-- Rename new table
ALTER TABLE QuoteRequest_new RENAME TO QuoteRequest;
