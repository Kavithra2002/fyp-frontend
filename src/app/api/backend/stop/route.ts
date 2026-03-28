import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Backend process management from frontend API is disabled. Stop backend from terminal.",
    },
    { status: 403 }
  );
}

