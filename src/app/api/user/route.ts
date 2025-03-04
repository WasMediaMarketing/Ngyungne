import { NextRequest } from "next/server";
import { createUserController } from "@/lib/factories/userFactory";
import { isAuthenticated, validateUserInput } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/user:
 *     post:
 *       summary: Create a new user
 *       description: This endpoint creates a new user in the system.
 *       tags:
 *         - User
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the user
 *                 email:
 *                   type: string
 *                   description: Email of the user
 *                 phoneNumber:
 *                   type: string
 *                   description: Phone number of the user
 *                 role:
 *                   type: string
 *                   enum: [user, admin, volunteer, donator]
 *                   description: Role of the user
 *                 password:
 *                   type: string
 *                   description: Password of the user (only required for creating new admin)
 *                 page:
 *                   type: string
 *                   description: Page for the user (required for non-admin users)
 *                 pageTitle:
 *                   type: string
 *                   description: Page title for the user (required for non-admin users)
 *       responses:
 *         201:
 *           description: User created successfully
 *         400:
 *           description: Bad request if input validation fails
 *         401:
 *           description: Unauthorized if token is invalid or missing
 *         500:
 *           description: Internal server error
 *     get:
 *       summary: Get all users
 *       description: This endpoint retrieves all users in the system.
 *       tags:
 *         - User
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: List of users retrieved successfully
 *         401:
 *           description: Unauthorized if token is invalid or missing
 *         500:
 *           description: Internal server error
 *     delete:
 *       summary: Delete users by their IDs
 *       description: Delete multiple users based on their user IDs.
 *       tags:
 *         - User
 *       parameters:
 *         - in: query
 *           name: userIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of user IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Users successfully deleted.
 *         401:
 *           description: Unauthorized - The request is not authenticated.
 *         404:
 *           description: No users found for the given IDs.
 *         500:
 *           description: Internal server error.
 */

export async function POST(req: NextRequest) {
  const reqClone = req.clone();
  console.log(reqClone, "req clone");
  const valdiateuserBody = await validateUserInput(req);
  if (valdiateuserBody) return valdiateuserBody;

  const userController = createUserController();
  return userController.createUser(req);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createUserController();
  return userController.getUsers();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createUserController();
  return userController.deleteUsers(req);
}
