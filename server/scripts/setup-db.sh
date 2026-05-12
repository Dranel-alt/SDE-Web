#!/bin/bash

# Initialize database with migration files
# This script runs the SQL migrations to set up your database schema

set -e

echo "📦 Setting up e-Reklamo database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  echo "Please add your Supabase connection string to .env"
  exit 1
fi

# Run migrations
echo "Running migrations..."
psql "$DATABASE_URL" -f migrations/001_create_users.sql
psql "$DATABASE_URL" -f migrations/002_create_complaints.sql

echo "✅ Database setup complete!"
echo "You can now start the backend: npm run dev"
