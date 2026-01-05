keyword="tags:\n  - reason"

replacement="tags:\n  - enzyme"

grep -rl "$keyword" $1 | while IFS= read -r file
do
  # Store the original file modification time
  original_time=$(stat -f "%m" "$file")

  # Replace the keyword
  sed -i '' "s/$keyword/$replacement/g" "$file"

  # Restore the original file modification time
  touch -mt $(date -r $original_time "+%Y%m%d%H%M.%S") "$file"
done