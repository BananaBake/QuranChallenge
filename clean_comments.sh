#!/bin/bash

# Find all .ts and .tsx files and remove lines with only a comment (// ...)
find client/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '/^\s*\/\/[^/]/d' {} \;

# Count how many comment lines were removed
echo "Removed comment lines from TS and TSX files."
