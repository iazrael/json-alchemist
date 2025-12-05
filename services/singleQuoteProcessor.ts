export const processSingleQuotes = (jsonString: string): string => {
  // State tracking variables
  let inDoubleQuotedString = false;
  let inSingleQuotedString = false;
  let escapeNext = false;
  let result = '';
  
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString[i];
    
    // Handle escape sequences
    if (escapeNext) {
      // If we're in a single-quoted string and the escaped character is a single quote,
      // we need to unescape it in the resulting double-quoted string
      if (inSingleQuotedString && char === "'") {
        result += "'";
      } else {
        result += char;
      }
      escapeNext = false;
      continue;
    }
    
    // Mark next character as escaped if current is backslash
    if (char === '\\') {
      result += char;
      escapeNext = true;
      continue;
    }
    
    // Toggle string state for double quotes
    if (char === '"' && !inSingleQuotedString) {
      inDoubleQuotedString = !inDoubleQuotedString;
      result += char;
      continue;
    }
    
    // Toggle string state for single quotes
    if (char === "'" && !inDoubleQuotedString) {
      inSingleQuotedString = !inSingleQuotedString;
      // Replace single quote with double quote in result
      result += '"';
      continue;
    }
    
    // Handle characters inside single-quoted strings
    if (inSingleQuotedString) {
      // If we encounter a double quote inside a single-quoted string,
      // we need to escape it
      if (char === '"') {
        result += '\\"';
      } else {
        result += char;
      }
      continue;
    }
    
    // Handle colon outside of strings to detect keys vs values
    if (char === ':' && !inDoubleQuotedString && !inSingleQuotedString) {
      result += char;
      continue;
    }
    
    // Handle commas and braces/brackets to detect structure
    if ((char === ',' || char === '{' || char === '}' || char === '[' || char === ']') && !inDoubleQuotedString && !inSingleQuotedString) {
      result += char;
      continue;
    }
    
    // Add the character as-is
    result += char;
  }
  
  return result;
};