import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // In a real app, authenticate with your database
    // For demo purposes, we'll create a user session
    const authenticatedUser = {
      ...userData,
      id: userData.id || `user_${Date.now()}`,
      createdAt: userData.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    return NextResponse.json(authenticatedUser)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
