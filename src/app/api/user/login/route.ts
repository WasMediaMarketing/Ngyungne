import { createUserController } from "@/lib/factories/userFactory";
import { NextRequest } from "next/server";

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: Login user and return JWT token
 *     description: This endpoint allows a user to log in by providing their email and password. On successful login, a JWT token is returned.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User logged in successfully, returns the user details and JWT token.
 *         content:
 *           application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID.
 *                   name:
 *                     type: string
 *                     description: The user's name.
 *                   email:
 *                     type: string
 *                     description: The user's email address.
 *                   role:
 *                     type: string
 *                     description: The user's role (e.g., admin, user, etc.).
 *               token:
 *                 type: string
 *                 description: The JWT token for authenticated requests.
 *       400:
 *         description: Invalid credentials or bad request.
 *       401:
 *         description: Unauthorized if the login credentials are invalid.
 *       500:
 *         description: Internal server error.
 */

export async function POST(req: NextRequest) {
  const userController = createUserController();
  return userController.loginUser(req);
}
