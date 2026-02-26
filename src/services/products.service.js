import { prisma } from "../config/db.js";

async function list() {
    return prisma.product.findMany({
        where: { active: true },
        include: { image: true },
        orderBy: { createdAt: `desc` }
    });
}

async function getById({ id }) {
    return prisma.product.findUnique({
        where: { id },
        include: { image: true }
    });
}

async function create({ data }) {
    return prisma.product.create({
        data: {
            ...data,
            active: data.active ?? true
        }
    });
}

async function update({ id, data }) {
    const existingProduct = await prisma.product.findUnique({
        where: { id }
    });

    if (!existingProduct) return null;

    return prisma.product.update({
        where: { id },
        data
    });
}

async function toggleActive({ id }) {
    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) return null;

    return prisma.product.update({
        where: { id },
        data: { active: !product.active }
    });
}

export default {
    list,
    getById,
    create,
    update,
    toggleActive
}