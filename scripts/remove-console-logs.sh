#!/bin/bash

# Remove console.log statements from frontend components
find ./src/components -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' '/console\.log(/d' {} +

# Remove console.log statements from frontend hooks (except API routes)
find ./src/lib/hooks -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' '/console\.log(/d' {} +

# Keep console.log statements in API routes and server-side code
echo "Removed console.log statements from frontend code"
