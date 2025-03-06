/**
 * Function to parse specified fields of the request body that contain valid JSON strings
 * or numeric strings. If a field contains a valid JSON string, it will be parsed to an object or array.
 * If a field contains a valid numeric string, it will be converted to a number.
 * If parsing fails, an error response is returned.
 *
 * @param body - The body of the request to parse
 * @param fields - Array of field names to parse as JSON
 * @param numericFields - Array of field names to parse as numbers
 * @returns The updated body with parsed fields.
 */
export function parseJsonAndNumbersFields(
  body: Record<string, unknown>,
  fields: string[] = [], // Fields to be parsed as JSON
  numericFields: string[] = [] // Fields to be parsed as numbers
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

  return body;
}
