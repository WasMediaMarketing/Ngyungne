/* eslint-disable @typescript-eslint/no-require-imports */
// Start with this line to register ts-node
const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "This is the API documentation for my Next.js app.",
  },
  servers: [
    {
      url: "http://localhost:3000/api", // Adjust your base URL
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: [
    // Add paths to your API files
    path.join(__dirname, "../src/app/api/user/route.ts"),
    path.join(__dirname, "../src/app/api/user/[userId]/route.ts"),
    path.join(__dirname, "../src/app/api/user/login/route.ts"),
    path.join(__dirname, "../src/app/api/user/admin-init/route.ts"),
    path.join(__dirname, "../src/app/api/donation/route.ts"),
    path.join(__dirname, "../src/app/api/donation/[donationId]/route.ts"),
    path.join(__dirname, "../src/app/api/contact/route.ts"),
    path.join(__dirname, "../src/app/api/contact/[contactId]/route.ts"),
    path.join(__dirname, "../src/app/api/event/route.ts"),
    path.join(__dirname, "../src/app/api/event/[eventId]/route.ts"),
    path.join(__dirname, "../src/app/api/volunteer/route.ts"),
    path.join(__dirname, "../src/app/api/volunteer/[volunteerId]/route.ts"),
  ],
};
console.log("Swagger API files being considered:");
options.apis.forEach((apiPath) => console.log(apiPath));
// Generate swagger specification
const swaggerSpec = swaggerJsdoc(options);

// Write the Swagger JSON to a file
fs.writeFileSync(
  path.join(__dirname, "../public/swagger.json"),
  JSON.stringify(swaggerSpec, null, 2)
);
