import { prisma } from "../config/db.js";

async function list() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: { createdAt: `desc`}
    });
}

async function getById({ id }) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

async function update({ id, data }) {
    const existingUser = await prisma.user.findUnique({
        where: { id }
    });

    if (!existingUser) {
        const error = new Error(`Usuário não encontrado`);
        error.status = 404;
        throw error;
    }
    if (data.email) {
        const emailExists = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (emailExists && emailExists.id !== id) {
            const error = new Error(`Email já cadastrado`);
            error.status = 400;
            throw error;
        }
    }

    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

async function deleteUser({ id }) {
    const existingUser = await prisma.user.findUnique({
        where: { id }
    });

    if (!existingUser) return false;

    await prisma.user.delete({
        where: { id }
    });

    return true;
}

async function changeRole({ id, role }) {
    if (![`USER`, `ADMIN`].includes(role)) throw new Error(`INVALID_ROLE`);

    const existingUser = await prisma.user.findUnique({
        where: { id }
    });

    if (!existingUser) return null;
    
    return prisma.user.update({
        where: { id },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

export default {
    list,
    getById,
    update,
    deleteUser,
    changeRole
}