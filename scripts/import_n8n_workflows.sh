#!/bin/bash

# Cafe24 CRM Prototype - n8n Workflow Import Script
# This script imports all workflow JSON files into n8n

set -e

# Configuration
N8N_URL="https://n8n.saemiro.com"
CF_ACCESS_CLIENT_ID="33fc2fac58bf5237d16ac159db51b46b.access"
CF_ACCESS_CLIENT_SECRET="7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c"
WORKFLOW_DIR="/Users/admin/cafe24-crm-prototype/n8n-workflows"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "======================================"
echo "Cafe24 CRM Prototype - n8n Workflow Import"
echo "======================================"
echo ""

# Check n8n health
echo -n "Checking n8n health... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${N8N_URL}/healthz" \
  -H "CF-Access-Client-Id: ${CF_ACCESS_CLIENT_ID}" \
  -H "CF-Access-Client-Secret: ${CF_ACCESS_CLIENT_SECRET}")

if [ "$HTTP_STATUS" == "200" ]; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}FAILED (HTTP ${HTTP_STATUS})${NC}"
  exit 1
fi

echo ""
echo "Workflow files to import:"
echo "-------------------------"
ls -1 ${WORKFLOW_DIR}/*.json 2>/dev/null || echo "No JSON files found"
echo ""

# Import each workflow
for WORKFLOW_FILE in ${WORKFLOW_DIR}/*.json; do
  if [ -f "$WORKFLOW_FILE" ]; then
    WORKFLOW_NAME=$(basename "$WORKFLOW_FILE" .json)
    echo -n "Importing ${WORKFLOW_NAME}... "

    # Create workflow via n8n API
    RESPONSE=$(curl -s -X POST "${N8N_URL}/rest/workflows" \
      -H "CF-Access-Client-Id: ${CF_ACCESS_CLIENT_ID}" \
      -H "CF-Access-Client-Secret: ${CF_ACCESS_CLIENT_SECRET}" \
      -H "Content-Type: application/json" \
      -d @"${WORKFLOW_FILE}" 2>&1)

    # Check if successful
    if echo "$RESPONSE" | grep -q '"id"'; then
      WORKFLOW_ID=$(echo "$RESPONSE" | jq -r '.id // "unknown"')
      echo -e "${GREEN}OK (ID: ${WORKFLOW_ID})${NC}"
    elif echo "$RESPONSE" | grep -q 'already exists'; then
      echo -e "${YELLOW}SKIPPED (already exists)${NC}"
    else
      echo -e "${RED}FAILED${NC}"
      echo "  Response: $(echo "$RESPONSE" | head -c 200)"
    fi
  fi
done

echo ""
echo "======================================"
echo "Import process completed!"
echo ""
echo "Next steps:"
echo "1. Go to ${N8N_URL} to verify workflows"
echo "2. Configure credentials in n8n"
echo "3. Activate workflows as needed"
echo "======================================"
