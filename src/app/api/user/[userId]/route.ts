import { NextRequest } from "next/server";
import { createUserController } from "@/lib/factories/userFactory";
import { isAuthenticated, validateUserUpdate } from "@/lib/middlewares";

/**
 * @openapi
 * /api/user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Fetch a user's details by their user ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to fetch.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user's ID.
 *                 name:
 *                   type: string
 *                   description: The user's name.
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *                 role:
 *                   type: string
 *                   description: The user's role (e.g., user, admin).
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: User not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 * patch:
 *     summary: Update user by ID
 *     description: Update the user's details based on their user ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email of the user.
 *               phoneNumber:
 *                 type: string
 *                 description: The updated phone number of the user.
 *               role:
 *                 type: string
 *                 enum: [user, admin, volunteer, donator]
 *                 description: The updated role of the user.
 *               password:
 *                 type: string
 *                 description: The updated password of the user (if provided).
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user's ID.
 *                 name:
 *                   type: string
 *                   description: The updated name of the user.
 *                 email:
 *                   type: string
 *                   description: The updated email of the user.
 *                 role:
 *                   type: string
 *                   description: The updated role of the user.
 *       400:
 *         description: Bad request - Invalid or incomplete data.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: User not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 * delete:
 *     summary: Delete user by ID
 *     description: Delete a user based on their user ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: User successfully deleted.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: User not found for the given ID.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createUserController();
  return userController.getUserById(req);
}

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validateUserBody = await validateUserUpdate(req);
  if (validateUserBody) return validateUserBody;

  const userController = createUserController();
  return userController.updateUser(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createUserController();
  return userController.deleteUser(req);
}
