// File: app/api/admin/verify/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;

    const adminPassword = process.env.ADMIN_PASSWORD;

    // Verify credentials
    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
