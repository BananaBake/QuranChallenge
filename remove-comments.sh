
#!/bin/bash

# Find all .ts and .tsx files and process them with sed
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" | while read -r file; do
  # Create a temporary file
  temp_file=$(mktemp)
  
  # Remove single-line and multi-line comments, preserving URLs in import statements
  sed -E '
    # Skip import lines containing URLs
    /^[[:space:]]*import.*from.*:\/\// b
    
    # Remove single-line comments not part of a URL
    s|//.*$||g
    
    # Remove multi-line comments
    /\/\*/,/\*\// {
      /\/\*/d
      /\*\//d
      d
    }
  ' "$file" > "$temp_file"
  
  # Remove empty lines
  sed -i '/^[[:space:]]*$/d' "$temp_file"
  
  # Move temporary file back to original
  mv "$temp_file" "$file"
done
