import { prisma } from "../config/db.js";

export default async function checkBlacklist(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(" ")[1];

    const blocked = await prisma.blacklistedToken.findUnique({
        where: { token }
    });

    if(blocked) {
        return res.status(401).json({ message: "Token inválido" });
    }

    return next();
}