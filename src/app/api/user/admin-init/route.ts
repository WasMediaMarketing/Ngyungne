// /app/api/init-admin/route.ts
import { NextResponse } from "next/server";
import { User } from "@/lib/models";
import { connectToDatabase } from "@/lib/utils/mongodb";

const createAdminIfNeeded = async () => {
  try {
    const email: string = process.env.INITIAL_ADMIN_EMAIL!;
    const password: string = process.env.INITIAL_ADMIN_PASSWORD!;

    console.log(email, password);
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      console.log("Creating admin user...");

      const newAdmin = new User({
        name: "Admin User",
        email: email,
        phoneNumber: "1234567890",
        role: "admin",
        password: password,
      });

      await newAdmin.save();
      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};
/**
 * @openapi
 * /api/init-admin:
 *   get:
 *     summary: Initializes the admin user if it doesn't exist
 *     description: Checks if an admin user exists in the database, and if not, creates one with the email and password specified in environment variables.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Admin check complete. Admin user exists or has been created successfully.
 *         content:
 *           application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Message indicating the status of the admin user creation.
 *                 example: Admin check complete
 *       500:
 *         description: Internal server error. Could not initialize the admin user.
 *         content:
 *           application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 description: Error message indicating the failure reason.
 *                 example: Failed to initialize admin user
 */
export async function GET() {
  try {
    await connectToDatabase();
    await createAdminIfNeeded();

    return NextResponse.json({ message: "Admin check complete" });
  } catch (error: unknown) {
    console.log("error initiating admin", error);
    return NextResponse.json(
      { error: "Failed to initialize admin user" },
      { status: 500 }
    );
  }
}
