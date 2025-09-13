//add new coupon

import { inngest } from "@/inngest/client";
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


        const { coupon } = await req.json();

        coupon.code = coupon.code.toUpperCase();
        await prisma.coupon.create({ data: coupon }).then(async (coupon) => {
            //run inngest scheduler function to delete coupon on expiry
            await inngest.send({
                name: "app/coupon.expired",
                data: { code: coupon.code, expires_at: coupon.expiresAt }
            })
        })

        return NextResponse.json({ message: "Coupon added successfully" });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

//delete coupon api/coupon?id=couponId

export async function DELETE(req) {
    try {
        const { userId } = getAuth(req);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = req.nextUrl;
        const code = searchParams.get('code');

        await prisma.coupon.delete({ where: { code } });
        return NextResponse.json({ message: "Coupon deleted successfully" });
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

//Get all coupon, write here

export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const coupons = await prisma.coupon.findMany({});
        return NextResponse.json({ coupons });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}