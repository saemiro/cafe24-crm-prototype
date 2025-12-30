#!/bin/bash
# Cafe24 CRM Prototype - Infrastructure Connection Test
# Tests: Qdrant, Neo4j, n8n, Slack

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Cloudflare Access credentials
CF_CLIENT_ID="33fc2fac58bf5237d16ac159db51b46b.access"
CF_CLIENT_SECRET="7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c"

echo "=========================================="
echo "Cafe24 CRM Prototype - Connection Tests"
echo "=========================================="
echo ""

# Test 1: Qdrant
echo -n "1. Qdrant (qdrant.saemiro.com)... "
QDRANT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "CF-Access-Client-Id: $CF_CLIENT_ID" \
  -H "CF-Access-Client-Secret: $CF_CLIENT_SECRET" \
  "https://qdrant.saemiro.com/collections")

if [ "$QDRANT_STATUS" = "200" ]; then
  echo -e "${GREEN}OK${NC} (HTTP $QDRANT_STATUS)"
else
  echo -e "${RED}FAIL${NC} (HTTP $QDRANT_STATUS)"
fi

# Test 2: Neo4j
echo -n "2. Neo4j (neo4j.saemiro.com)... "
NEO4J_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "CF-Access-Client-Id: $CF_CLIENT_ID" \
  -H "CF-Access-Client-Secret: $CF_CLIENT_SECRET" \
  "https://neo4j.saemiro.com")

if [ "$NEO4J_STATUS" = "200" ]; then
  echo -e "${GREEN}OK${NC} (HTTP $NEO4J_STATUS)"
else
  echo -e "${YELLOW}CHECK${NC} (HTTP $NEO4J_STATUS - Neo4j Browser may redirect)"
fi

# Test 3: n8n
echo -n "3. n8n (n8n.saemiro.com)... "
N8N_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "CF-Access-Client-Id: $CF_CLIENT_ID" \
  -H "CF-Access-Client-Secret: $CF_CLIENT_SECRET" \
  "https://n8n.saemiro.com/healthz")

if [ "$N8N_STATUS" = "200" ]; then
  echo -e "${GREEN}OK${NC} (HTTP $N8N_STATUS)"
else
  echo -e "${YELLOW}CHECK${NC} (HTTP $N8N_STATUS)"
fi

# Test 4: LiteLLM
echo -n "4. LiteLLM (llm.saemiro.com)... "
LITELLM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "CF-Access-Client-Id: $CF_CLIENT_ID" \
  -H "CF-Access-Client-Secret: $CF_CLIENT_SECRET" \
  "https://llm.saemiro.com/health")

if [ "$LITELLM_STATUS" = "200" ]; then
  echo -e "${GREEN}OK${NC} (HTTP $LITELLM_STATUS)"
else
  echo -e "${YELLOW}CHECK${NC} (HTTP $LITELLM_STATUS)"
fi

# Test 5: Slack Webhook
echo -n "5. Slack Webhook... "
SLACK_WEBHOOK="https://hooks.slack.com/services/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"
SLACK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$SLACK_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d '{"text":"[CRM Prototype] Connection test successful!"}')

if [ "$SLACK_STATUS" = "200" ]; then
  echo -e "${GREEN}OK${NC} (HTTP $SLACK_STATUS - Message sent)"
else
  echo -e "${RED}FAIL${NC} (HTTP $SLACK_STATUS)"
fi

echo ""
echo "=========================================="
echo "Connection tests completed"
echo "=========================================="

# Check Qdrant collections for prototype
echo ""
echo "Checking Qdrant collections..."
COLLECTIONS=$(curl -s \
  -H "CF-Access-Client-Id: $CF_CLIENT_ID" \
  -H "CF-Access-Client-Secret: $CF_CLIENT_SECRET" \
  "https://qdrant.saemiro.com/collections" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)

echo "Existing collections:"
echo "$COLLECTIONS" | while read col; do
  if [[ "$col" == cafe24_* ]]; then
    echo "  - $col (CRM Prototype)"
  else
    echo "  - $col"
  fi
done

echo ""
echo "Next steps:"
echo "  1. Create cafe24_api_docs collection in Qdrant"
echo "  2. Create cafe24_crm_knowledge collection in Qdrant"
echo "  3. Set up n8n CRM-Prototype-* workflows"
