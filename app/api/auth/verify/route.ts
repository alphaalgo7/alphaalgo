import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // In a real app, verify the user session with your database
    // For demo purposes, we'll simulate verification
    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 401 })
    }

    // Simulate user data from database
    const userData = {
      id: userId,
      name: "Demo User",
      email: "demo@stoxxo.com",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
