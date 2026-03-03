import { prisma } from "../config/db.js";
import fs from "fs";
import path from "path";

async function upload({ userId, file }) {

    return prisma.file.create({
        data: {
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            userId
        }
    });

}

async function list() {
    return prisma.file.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: { createdAt: `desc` }
    });

}

async function getById({ id }) {

    const file = await prisma.file.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    if (!file) {
        const error = new Error(`Arquivo não encontrado`);
        error.status = 404;
        throw error;
    }

    return file;
}

async function deleteFiles({ id }) {
    const file = await prisma.file.findUnique({
        where: { id }
    });

    if (!file) {
        const error = new Error(`Arquivo não encontrado`);
        error.status = 404;
        throw error;
    }

    if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }

    await prisma.file.delete({
        where: { id }
    });

}

async function download({ id }) {
        const file = await prisma.file.findUnique({
            where: { id }
        });

        if (!file) {
            const error = new Error(`Arquivo não encontrado`);
            error.status = 404;
            throw error;
        }

        const filePath = path.resolve(file.path);

        if (!fs.existsSync(filePath)) {
            const error = new Error(`Arquivo físico não encontrado`);
            error.status = 404;
            throw error;
        }
        
        return { path: filePath, originalName: file.originalName };
}

export default {
    upload,
    list,
    getById,
    deleteFiles,
    download
};