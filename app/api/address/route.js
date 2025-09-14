//add new Address

import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const { cart } = await req.json();
        address.userId = userId
        //Save the caer to the user object
        const user = await prisma.user.update({ where: { id: userId }, data: { cart } });

        const newAddress = await prisma.address.create({
            data: { ...address, userId: user.id }
        });
        return NextResponse.json({ newAddress, message: "Address added successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

//Get all addres from user

export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        const addresses = await prisma.address.findMany({ where: { userId } });
        return NextResponse.json({ addresses });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}