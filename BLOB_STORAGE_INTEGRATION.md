# Azure Blob Storage Integration for Workspaces

This document describes how Azure Blob Storage is integrated with workspace creation in the AIVA application.

## Overview

When an admin creates a workspace, the system automatically creates a corresponding folder within the main Azure Blob Storage container for that workspace. This allows for organized file storage where each workspace has its own dedicated storage folder within a single container.

## Implementation Details

### 1. Folder Creation

When a workspace is created:
1. A "workspace" parent folder is created in the main container
2. A unique workspace folder is generated using the workspace name and ID: `workspace/{workspaceName}-{workspaceId(first 7 digits)}/`
3. A placeholder blob is created in the main container to represent the folder
4. The folder path is stored with the workspace data
5. An Azure AI Search index is created for the workspace with the name format: `{workspaceName}-{workspaceId(first 7 digits)}index`

### 2. File Storage

When files are uploaded to a workspace:
1. Files are stored in the main container within the workspace-specific folder
2. File paths follow the format: `workspace/{workspaceName}-{workspaceId(first 7 digits)}/{fileId}-{originalFileName}`

### 3. Folder Deletion

When a workspace is deleted:
1. The corresponding folder and all files within it are deleted from the main container
2. All files stored in that folder are removed
3. The associated Azure AI Search index is deleted

## Services

### WorkspaceStorageService

A dedicated service (`WorkspaceStorageService`) handles all blob storage operations for workspaces:

- `createWorkspaceFolder(workspaceId, workspaceName)`: Creates a folder for a workspace within the main container
- `deleteWorkspaceFolder(workspaceId, workspaceName)`: Deletes a workspace's folder and all its contents
- `folderExists(workspaceId, workspaceName)`: Checks if a workspace folder exists
- `listWorkspaceBlobs(workspaceId, workspaceName)`: Lists all blobs in a workspace folder
- `getWorkspaceFolderName(workspaceId, workspaceName)`: Gets the workspace folder name used for Azure Search index

### AzureSearchService

A dedicated service (`AzureSearchService`) handles all Azure AI Search operations:

- `createWorkspaceIndex(indexName)`: Creates a search index for a workspace
- `deleteWorkspaceIndex(indexName)`: Deletes a workspace's search index
- `indexExists(indexName)`: Checks if a search index exists
- `indexDocument(indexName, document)`: Indexes a document in the search index
- `searchDocuments(indexName, searchText, filter)`: Searches for documents in a workspace index

## Testing

Several test scripts are available to verify the blob storage integration:

### 1. Basic Blob Storage Test
```bash
npm run test-blob-storage
```

### 2. Workspace Blob Storage Test
```bash
npm run test-workspace-blob-storage
```

### 3. Verification Script
```bash
npm run verify-blob-storage
```

### 4. Admin Workspace Creation Test
```bash
npm run test-admin-workspace-creation
```

## Access Control

### Private Workspaces
- Files in private workspaces are only accessible to the admin who owns the workspace

### Shared Workspaces
- Files in shared workspaces are accessible to the admin owner and all assigned members

## Future Enhancements

- Add file upload/download functionality directly to workspace folders
- Implement access control for folder contents
- Add metrics and monitoring for storage usage per workspace
- Enhance semantic search capabilities in Azure AI Search