//update user cart

import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { cartItems } = await req.json();
        const { userId } = getAuth(req);
        //save the cart to the user object
        await prisma.user.update({
            where: { id: userId },
            data: { cart: cartItems }
        })

        return NextResponse.json({ message: "Cart updated successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });

    }

}

//GET user cart

export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return NextResponse.json({ cart: user.cart });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}