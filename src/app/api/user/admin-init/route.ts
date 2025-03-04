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
