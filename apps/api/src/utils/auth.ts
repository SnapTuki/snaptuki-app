import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "snaptuki_secret";

export const createToken = (user: any) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
