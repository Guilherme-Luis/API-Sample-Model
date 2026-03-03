import { prisma } from "../config/db.js";

async function list() {
    return prisma.company.findMany({
        where: { active: true },
        include: { image: true },
        orderBy: { createdAt: `desc` }
    });

}

async function getById({ id }) {
    const company = await prisma.company.findUnique({
        where: { id },
        include: { image: true }
    });

    if (!company || !company.active) {
        const error = new Error(`Empresa não encontrada ou não está ativa`);
        error.status = 404;
        throw error;
    };

    return company;
}

async function create({ name, cnpj, email, phone, imageId }) {

    const exists = await prisma.company.findUnique({
        where: { cnpj }
    });

    if (exists) {
        const error = new Error(`Empresa já cadastrada`);
        error.status = 409;
        throw error;
    }

    return prisma.company.create({
        data: { name, cnpj, email, phone, imageId }
    });
}

async function update({ id, data }) {

    const company = await prisma.company.findUnique({
        where: { id }
    });

    if (!company || !company.active) {
        const error = new Error(`Empresa não encontrada ou não está ativa`);
        error.status = 404;
        throw error;
    }

    if (data.cnpj) {
        const exists = await prisma.company.findUnique({
            where: { cnpj: data.cnpj }
        });

        if (exists && exists.id !== id) {
            const error = new Error(`CNPJ já cadastrado para outra empresa`);
            error.status = 409;
            throw error;
        }
    }

    return prisma.company.update({
        where: { id },
        data
    });
}

async function deleteCompany({ id }) {

    const company = await prisma.company.findUnique({
        where: { id }
    });

    if (!company || !company.active) {
        const error = new Error(`Empresa não encontrada ou não está ativa`);
        error.status = 404;
        throw error;
    }

    await prisma.company.update({
        where: { id },
        data: { active: false }
    });
}

export default {
    list,
    getById,
    create,
    update,
    deleteCompany
};