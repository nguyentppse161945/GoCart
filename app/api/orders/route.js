//create order 

import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {

        const { userId, has } = getAuth(request);
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { addressId, items, couponCodes, paymentMethod } = await request.json();
        //check if required fileds present
        if (!addressId || !items || !Array.isArray(items) || items.length === 0 || !couponCodes || !paymentMethod) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let coupon = null;
        

        const order = await prisma.order.create({
            data: {
                userId,
                productId,
                quantity,
            },
        });
        return NextResponse.json({ order });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}