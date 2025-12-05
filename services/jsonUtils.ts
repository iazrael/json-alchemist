/**
 * Removes C-style comments (// and /* ... *\/) from a string.
 */
export const stripComments = (jsonString: string): string => {
  // Regex to match single line // comments and multi-line /* */ comments
  // It handles ignoring these patterns if they appear inside quotes
  const commentRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
  return jsonString.replace(commentRegex, '$1');
};

/**
 * Attempts to parse JSON, potentially leniently by stripping comments first.
 */
export const safeParse = (input: string): any => {
  try {
    return JSON.parse(input);
  } catch (e) {
    // If standard parse fails, try stripping comments (JSON5 style)
    try {
      const clean = stripComments(input);
      return JSON.parse(clean);
    } catch (e2) {
      throw e; // Throw original error or e2 depending on need, usually original is better context if not comments
    }
  }
};

export const formatJson = (input: string): string => {
  try {
    const obj = safeParse(input);
    return JSON.stringify(obj, null, 2);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const minifyJson = (input: string): string => {
  try {
    const obj = safeParse(input);
    return JSON.stringify(obj);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const validateJson = (input: string): { isValid: boolean; error: string | null } => {
  if (!input.trim()) return { isValid: true, error: null };
  try {
    safeParse(input);
    return { isValid: true, error: null };
  } catch (error: any) {
    return { isValid: false, error: error.message };
  }
};

/**
 * Heuristics to check if the string looks like a Golang struct or map dump.
 */
export const isGoLike = (input: string): boolean => {
  // Check for common Go patterns:
  // - map[string]...
  // - interface{}
  // - &SomeStruct{
  // - SomeStruct{ with Key: Value
  return (
    input.includes('map[') ||
    input.includes('interface{}') ||
    /&[a-zA-Z0-9_\.]+\s*\{/.test(input) ||
    // Heuristic for Struct{ Key: val } pattern which isn't valid JSON (no quotes on key)
    (/[a-zA-Z0-9_]+\s*\{[\s\S]*[a-zA-Z0-9_]+\s*:/.test(input) && !input.trim().startsWith('{'))
  );
};