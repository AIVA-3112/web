# Azure App Services Deployment Guide

This document provides instructions for deploying the frontend application to Azure App Services.

## Prerequisites

1. Azure subscription
2. Azure CLI installed
3. Git installed
4. Node.js 18.x or later

## Deployment Options

### Option 1: Deploy using Azure CLI (Recommended)

1. **Login to Azure CLI:**
   ```bash
   az login
   ```

2. **Create a resource group:**
   ```bash
   az group create --name aiva-frontend-rg --location "East US"
   ```

3. **Create an App Service plan:**
   ```bash
   az appservice plan create --name aiva-frontend-plan --resource-group aiva-frontend-rg --sku B1 --is-linux
   ```

4. **Create a web app:**
   ```bash
   az webapp create --resource-group aiva-frontend-rg --plan aiva-frontend-plan --name aiva-frontend-app --runtime "NODE:18-lts"
   ```

5. **Configure deployment settings:**
   ```bash
   az webapp config appsettings set --resource-group aiva-frontend-rg --name aiva-frontend-app --settings PORT=8080
   ```

6. **Set the startup command:**
   ```bash
   az webapp config set --resource-group aiva-frontend-rg --name aiva-frontend-app --startup-file "startup.sh"
   ```

7. **Deploy the application:**
   ```bash
   az webapp deployment source config-local-git --resource-group aiva-frontend-rg --name aiva-frontend-app
   ```

8. **Get the deployment URL:**
   ```bash
   az webapp deployment list-publishing-credentials --resource-group aiva-frontend-rg --name aiva-frontend-app --query scmUri --output tsv
   ```

9. **Add the remote and push:**
   ```bash
   git remote add azure <deployment-url>
   git add .
   git commit -m "Deploy to Azure App Services"
   git push azure main
   ```

### Option 2: Deploy using GitHub Actions

1. Fork this repository to your GitHub account
2. Create an Azure App Service
3. Configure GitHub Actions deployment in Azure Portal
4. Set the following environment variables in GitHub Secrets:
   - AZURE_CLIENT_ID
   - AZURE_CLIENT_SECRET
   - AZURE_TENANT_ID

## Startup Commands

Azure App Services requires a startup command to run the application. The following startup commands are available:

### For Linux App Services:
```bash
# Using the startup.sh script
./startup.sh

# Or directly using npm commands
npm install && npm run build && npm run preview
```

### For Windows App Services:
```cmd
# Using the startup.cmd script
startup.cmd

# Or directly using npm commands
npm install && npm run build && npm run preview
```

## Environment Variables

Set the following environment variables in your Azure App Service:

```env
# API Configuration
VITE_API_URL=https://web-production-50913.up.railway.app/api
VITE_APP_URL=https://your-app-name.azurewebsites.net

# Microsoft Entra ID Configuration
VITE_MICROSOFT_CLIENT_ID=your-client-id
VITE_MICROSOFT_TENANT_ID=your-tenant-id

# Other OAuth providers
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_YAHOO_CLIENT_ID=your-yahoo-client-id

# Node.js Configuration
PORT=8080
NODE_ENV=production
```

## Configuration Files

This deployment uses the following configuration files:

1. **[web.config](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/web.config)** - IIS configuration for Windows App Services
2. **[azure-staticwebapp.config.json](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/azure-staticwebapp.config.json)** - Configuration for Azure Static Web Apps
3. **[startup.sh](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/startup.sh)** - Linux startup script
4. **[startup.cmd](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/startup.cmd)** - Windows startup script

## Custom Domain Configuration

To configure a custom domain:

1. **Add a custom domain:**
   ```bash
   az webapp config hostname add --resource-group aiva-frontend-rg --webapp-name aiva-frontend-app --hostname www.yourdomain.com
   ```

2. **Configure SSL certificate:**
   ```bash
   az webapp config ssl bind --resource-group aiva-frontend-rg --name aiva-frontend-app --certificate-thumbprint <thumbprint> --ssl-type SNI
   ```

## Scaling

To scale the application:
1. Upgrade the App Service plan to a higher tier
2. Enable autoscaling based on CPU or memory usage

## Security

1. Always use HTTPS
2. Store secrets in Azure Key Vault
3. Regularly rotate passwords and API keys
4. Enable authentication and authorization

## Troubleshooting

### Common Issues

1. **Application not starting**: Check logs using `az webapp log tail --resource-group aiva-frontend-rg --name aiva-frontend-app`
2. **Blank page**: Verify that the build process completed successfully
3. **API connection errors**: Check environment variables and network settings

### Viewing Logs

```bash
az webapp log tail --resource-group aiva-frontend-rg --name aiva-frontend-app
```

### Restarting the Application

```bash
az webapp restart --resource-group aiva-frontend-rg --name aiva-frontend-app
```