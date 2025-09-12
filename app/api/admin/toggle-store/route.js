import prisma from "@/lib/prisma";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//toggle store isActive
export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const {storeId} = await req.json();

        if(!storeId) {
            return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
        }   
        //Find the store
        const store = await prisma.store.findUnique({
            where: { id: storeId },
        })
        if(!store){
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        await prisma.store.update({
            where: { id: storeId },
            data: {
                isActive: !store.isActive
            }
        })

        return NextResponse.json({ message: "Store status updated successfully" })
        return NextResponse.json({ message: "Store status updated successfully" })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
} 