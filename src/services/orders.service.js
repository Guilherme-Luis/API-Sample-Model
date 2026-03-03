import { prisma } from "../config/db.js";

async function cancel({ id, userId, role}) {
    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true }
    });

    if (!order) throw new Error(`NOT_FOUND`);
    if (role !== `ADMIN` && order.userId !== userId) throw new Error(`FORBIDDEN`);
    if (order.status !== `PENDING`) throw new Error(`INVALID_STATUS`);

    await prisma.$transaction(async (tx) => {
        await tx.order.update({
            where: { id },
            data: { status: `CANCELED` }
        });
        
        for (const item of order.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } }
            });
        }
    });
}

async function updateStatus({ id, status }) {
    const allowed = [ `PENDING`, `SHIPPED`, `CANCELED` ];
    if (!allowed.includes(status)) throw new Error(`INVALID_STATUS`); 

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true }
    });

    if (!order) throw new Error(`NOT_FOUND`);

    if (order.status === `CANCELED`) throw new Error(`INVALID_STATUS`);

    if (status === `CANCELED`) {
        await prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id },
                data: { status }
            });

            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                });
            }
        });
    } else {
        await prisma.order.update({
            where: { id },
            data: { status }
        });
    }
}

async function summary({ userId, role }) {
    const where = role === `ADMIN` ? {} : { userId };

    const aggregate = await prisma.order.aggregate({
        where,
        _count: { id: true },
        _sum: { total: true }
    });

    const orders = await prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: `desc` }
    });

    return {
        totalOrders: aggregate._count.id,
        totalValue: aggregate._sum.total || 0,
        orders
    };
}

async function create({ userId, items}) {
    let total = 0;
    if (!items?.length) throw new Error(`INVALID_ITEMS`);

    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
    });

    if (products.length !== productIds.length)throw new Error(`PRODUCT_NOT_FOUND`);

    for (const item of items) {
        const product = products.find(p => p.id === item.productId);

        if (!product.active) throw new Error(`PRODUCT_NOT_FOUND`);

        if (product.stock < item.quantity)throw new Error(`INSUFFICIENT_STOCK`);

        total += product.price * item.quantity;
    }

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                total,
                status: `PENDING`,
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: products.find(p => p.id === item.productId).price
                    }))
                }
            },
            include: { items: true }
        });

        for (const item of items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            });
        }

        return order;
    });
}

export default {
    cancel,
    updateStatus,
    summary,
    create
}