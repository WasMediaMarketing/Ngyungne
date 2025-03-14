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
        // Trying to parse the field as JSON
        body[field] = JSON.parse(body[field] as string);
      } catch (e) {
        // If parsing fails, log the error
        console.error(
          `Error parsing JSON in field: ${field}, value:`,
          body[field]
        );
        throw new Error(`Invalid JSON format in field: ${field}`);
      }
    }
  });

  // Parse numeric fields
  numericFields.forEach((field) => {
    if (body[field] && typeof body[field] === "string") {
      const parsedNumber = Number(body[field]);
      if (isNaN(parsedNumber)) {
        console.error(
          `Invalid number format in field: ${field}, value:`,
          body[field]
        );
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
        console.error(
          `Invalid boolean format in field: ${field}, value:`,
          body[field]
        );
        throw new Error(`Invalid boolean format in field: ${field}`);
      }
    }
  });

  return body;
}
