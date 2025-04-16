export const httpMessages = {
  NOT_FOUND: (resource: string = "Data") => ({
    statusCode: 404,
    message: `${resource} Not Found.`,
  }),
  ALREADY_PRESENT: (resource: string = "Data") => ({
    statusCode: 409,
    message: `${resource}  Already Exists.`,
  }),
  INVALID_CREDENTIALS: (resource: string = "Invalid email or password") => ({
    statusCode: 401,
    message: `${resource}.`,
  }),
  FORBIDDEN: (reason: string = "Request") => ({
    statusCode: 403,
    message: `${reason} is Forbidden.`,
  }),
  UNAUTHORIZED: (reason: string = "Unauthorized access") => ({
    statusCode: 401,
    message: `${reason}.`,
  }),
  UNAUTHORIZED_NO_DATA: (
    message: string = "Unable to verify credentials from the token"
  ) => ({
    statusCode: 401,
    message: `${message}.`,
  }),
  UNAUTHORIZED_NO_TOKEN: {
    statusCode: 401,
    message: "Unauthorized access: No token provided",
  },
  UNAUTHORIZED_INVALID_TOKEN: {
    statusCode: 401,
    message: "Unauthorized access: Invalid token",
  },
  UNAUTHORIZED_TOKEN_EXPIRED: {
    statusCode: 401,
    message: "Unauthorized access: expired token",
  },
  BAD_REQUEST: (details: string = "") => ({
    statusCode: 400,
    message: `Bad request${details ? `: ${details}` : ""}`,
  }),
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: "Internal server error",
  },

  OK: (message: string = "Request") => ({
    statusCode: 200,
    message: `${message} was successful.`,
  }),
  CREATED: (message: string = "Resource") => ({
    statusCode: 201,
    message: `${message} successfully created.`,
  }),
  CONFLICT: (message?: string) => ({
    statusCode: 409,
    message: message ?? "Conflict",
  }),
};
