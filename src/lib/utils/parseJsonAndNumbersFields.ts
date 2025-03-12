/**
 * Function to parse specified fields of the request body that contain valid JSON strings,
 * numeric strings, or boolean strings. If a field contains a valid JSON string, it will be
 * parsed to an object or array. If a field contains a valid numeric string, it will be converted
 * to a number. If a field contains 'true' or 'false' (case-insensitive), it will be parsed as
 * a boolean value. If parsing fails, an error response is returned.
 *
 * @param body - The body of the request to parse
 * @param fields - Array of field names to parse as JSON
 * @param numericFields - Array of field names to parse as numbers
 * @param booleanFields - Array of field names to parse as booleans
 * @returns The updated body with parsed fields.
 */
export function parseJsonAndNumbersFields(
  body: Record<string, unknown>,
  fields: string[] = [], // Fields to be parsed as JSON
  numericFields: string[] = [], // Fields to be parsed as numbers
  booleanFields: string[] = [] // Fields to be parsed as booleans
): Record<string, unknown> {
  // Parse JSON fields
  fields.forEach((field) => {
    if (body[field] && typeof body[field] === "string") {
      try {
        body[field] = JSON.parse(body[field] as string);
      } catch {
        throw new Error(`Invalid JSON format in field: ${field}`);
      }
    }
  });

  // Parse numeric fields
  numericFields.forEach((field) => {
    if (body[field] && typeof body[field] === "string") {
      const parsedNumber = Number(body[field]);
      if (isNaN(parsedNumber)) {
        throw new Error(`Invalid number format in field: ${field}`);
      }
      body[field] = parsedNumber;
    }
  });

  // Parse boolean fields
  booleanFields.forEach((field) => {
    if (body[field] && typeof body[field] === "string") {
      const value = (body[field] as string).toLowerCase();
      if (value === "true") {
        body[field] = true;
      } else if (value === "false") {
        body[field] = false;
      } else {
        throw new Error(`Invalid boolean format in field: ${field}`);
      }
    }
  });

  return body;
}
