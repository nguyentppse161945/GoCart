import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextj/server";
import { NextResponse } from "next/server";
//auth Admin


export async function GET(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}
