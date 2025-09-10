import { inngest } from "./client";
import prisma from "@/lib/prisma";

export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-create"
    },
    { event: "clerk/user.created" },
    async ({ event, }) => {
        const { data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${last_name}`,
                imageUrl: data.image_url,
            }
        });



    }

);
//Inngest Function to update user data in db
export const syncUserUpdation = inngest.createFunction(
    {
        id: "sync-user-update"
    },
    { event: "clerk/user.updated" },
    async ({ event, }) => {
        const { data } = event;
        await prisma.user.update({
            where: { id: data.id },
            data: {
                _id: data.id,
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${last_name}`,
                imageUrl: data.image_url,
            }
        });

    }
);

// Inngest Function to delete user data in db
export const syncUserDeletion = inngest.createFunction(
    {
        id: "sync-user-delete"
    },
    { event: "clerk/user.deleted" },
    async ({ event, }) => {
        const { data } = event;
        await prisma.user.delete({
            where: { id: data.id },
        });
    }
);

//inngest Function to handle order creation event from user


export const createUserOrder = inngest.createFunction(
    {
        id: "create-user-order",
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        },
    },
    { event: "order/created" },
    async ({ events }) => {

        const orders = events.map((event) => {
            return {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date,
            }
        })

        await connectDB();
        await Order.insertMany(orders);
        return { success: true, processed: orders.length }
    }
)
