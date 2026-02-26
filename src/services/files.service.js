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
        throw new Error(`Arquivo não encontrado`);
    }

    return file;
}

async function deleteFiles({ id }) {
    const file = await prisma.file.findUnique({
        where: { id }
    });

    if (!file) {
        throw new Error(`Arquivo não encontrado`);
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
            throw new Error( `Arquivo não encontrado` );
        }

        const filePath = path.resolve(file.path);

        if (!fs.existsSync(filePath)) {
            throw new Error( `Arquivo físico não encontrado` );
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