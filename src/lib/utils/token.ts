import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error(
    "❌ Please define JWT_SECRET and JWT_EXPIRES_IN in environment variables"
  );
}

export const generateToken = (user: {
  id: string;
  role: string;
  email: string;
}) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};
