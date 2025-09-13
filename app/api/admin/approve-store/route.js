import prisma from "@/lib/prisma";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { storeId, status } = await req.json();

        if (status == 'approved') {
            await prisma.store.update({
                where: { id: storeId },
                data: {
                    status: 'approved',
                    isActive: true
                }
            })
        } else
            if (status == 'rejected') {
                await prisma.store.update({
                    where: { id: storeId },
                    data: {
                        status: 'rejected',
                        isActive: false
                    }
                })
            }

        return NextResponse.json({ message: status + 'successfully!' })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}


//Get all Pending and Rejected Stores
export async function GET(req) {
    try {
        const {userId} = getAuth(req);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const stores = await prisma.store.findMany({
            where: {
                status: { in: ['pending', 'rejected'] }
            },include:{user: true}
        })
        return NextResponse.json({stores})
    } catch (error) {   
        console.log(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}