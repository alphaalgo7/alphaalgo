import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, data } = await request.json()

    // In a real app, save to your database
    // For demo purposes, we'll simulate saving
    console.log(`Saving data for user ${userId}:`, data)

    // You would typically save to a database like:
    // await db.strategies.upsert({
    //   where: { userId },
    //   update: { data, updatedAt: new Date() },
    //   create: { userId, data, createdAt: new Date() }
    // })

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
