#!/bin/bash

# Cafe24 CRM Prototype Deployment Script
# Usage: ./deploy.sh [api|frontend|all]

set -e

SERVER="yrseo@100.108.110.57"
PASSWORD="Dbwlsl12#$"
REMOTE_DIR="~/cafe24-crm"

echo "🚀 Cafe24 CRM Prototype Deployment"
echo "=================================="

# Function to run SSH commands
ssh_cmd() {
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER "$1"
}

# Function to copy files
scp_cmd() {
    sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no -r "$1" $SERVER:"$2"
}

case "${1:-all}" in
    api)
        echo "📦 Deploying API only..."
        ssh_cmd "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml build crm-api && docker compose -f docker-compose.prod.yml up -d crm-api"
        ;;
    frontend)
        echo "🎨 Deploying Frontend only..."
        ssh_cmd "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml build crm-frontend && docker compose -f docker-compose.prod.yml up -d crm-frontend"
        ;;
    all)
        echo "📁 Creating remote directory..."
        ssh_cmd "mkdir -p $REMOTE_DIR"

        echo "📤 Uploading project files..."
        scp_cmd "$(dirname $0)/../backend" "$REMOTE_DIR/"
        scp_cmd "$(dirname $0)/../frontend" "$REMOTE_DIR/"
        scp_cmd "$(dirname $0)/../docker-compose.prod.yml" "$REMOTE_DIR/"
        scp_cmd "$(dirname $0)/../.env.prod.example" "$REMOTE_DIR/.env"

        echo "🔨 Building and deploying..."
        ssh_cmd "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml build && docker compose -f docker-compose.prod.yml up -d"

        echo "🔄 Updating Cloudflare Tunnel config..."
        scp_cmd "$(dirname $0)/cloudflared-config.yml" "/tmp/config.yml"
        ssh_cmd 'echo "$PASSWORD" | sudo -S cp /tmp/config.yml /etc/cloudflared/config.yml 2>/dev/null && echo "$PASSWORD" | sudo -S systemctl restart cloudflared 2>/dev/null'
        ;;
    config)
        echo "🔧 Updating Cloudflare Tunnel config only..."
        scp_cmd "$(dirname $0)/cloudflared-config.yml" "/tmp/config.yml"
        ssh_cmd 'echo "Dbwlsl12#$" | sudo -S cp /tmp/config.yml /etc/cloudflared/config.yml 2>/dev/null && echo "Dbwlsl12#$" | sudo -S systemctl restart cloudflared 2>/dev/null'
        ;;
    *)
        echo "Usage: $0 [api|frontend|all|config]"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access URLs:"
echo "   - Frontend: https://crm.saemiro.com"
echo "   - API: https://crm-api.saemiro.com/api/health"
echo "   - Swagger: https://crm-api.saemiro.com/api/swagger-ui.html"
