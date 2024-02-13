import jwt from "jsonwebtoken";

export default async function apiAuthProvider(credentials) {
  try {
    const response = await fetch(`${process.env.BACKEND_API}/api/v1/auth/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    //verify jwt access token
    // const decoded = jwt.verify(data.accessToken, process.env.JWT_SECRET);
    if (data.error) {
      return { error: data.message };
    }

    const userID = data.userID;
    const accessToken = data.access_token;
    return { ...data, accessToken };
  } catch (error) {
    return { error: error.message };
  }
}

export const BAPI = process.env.BACKEND_SERVER as string;
export const Token = process.env.BEARER as string;
