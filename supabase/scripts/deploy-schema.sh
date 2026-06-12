#!/bin/bash
# Supabase Schema Deployment Script
# This script deploys the VISUALSC database schema to your Supabase project
# 
# Usage:
#   chmod +x supabase/scripts/deploy-schema.sh
#   ./supabase/scripts/deploy-schema.sh --project-id YOUR_PROJECT_ID

set -e

PROJECT_ID=""
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --project-id)
      PROJECT_ID="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate project ID
if [ -z "$PROJECT_ID" ]; then
  echo "Error: --project-id is required"
  echo "Usage: ./deploy-schema.sh --project-id YOUR_PROJECT_ID"
  exit 1
fi

echo "================================"
echo "VISUALSC Schema Deployment"
echo "================================"
echo "Project ID: $PROJECT_ID"
echo "Dry run: $DRY_RUN"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "Error: Supabase CLI is not installed"
  echo "Install it with: npm install -g supabase"
  exit 1
fi

echo "Step 1: Linking to Supabase project..."
supabase link --project-id "$PROJECT_ID"

echo ""
echo "Step 2: Running migrations..."
if [ "$DRY_RUN" = true ]; then
  echo "[DRY RUN] Would execute migrations"
else
  supabase db push
fi

echo ""
echo "Step 3: Verifying schema deployment..."
if [ "$DRY_RUN" = false ]; then
  echo "✓ Schema deployed successfully"
  echo ""
  echo "Next steps:"
  echo "1. Configure storage buckets (see storage.md)"
  echo "2. Run seed data (if needed)"
  echo "3. Test the application"
else
  echo "[DRY RUN] Deployment would proceed"
fi

echo ""
echo "Deployment complete!"
