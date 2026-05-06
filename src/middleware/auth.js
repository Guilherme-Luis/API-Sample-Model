import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const { JWT_SECRET } = process.env;

export default async function auth(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith(`Bearer `)) return res.status(401).json({ message: `Token ausente` });
    const token = authHeader.split(` `)[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                role: true,
                email: true
            }
        });
        if (!user) {
            return res.status(401).json({ message: `Usuário não encontrado` });
        }
        req.user = {
            id: user.id,
            role: user.role,
            email: user.email,
            exp: payload.exp
        };
        return next();
    } catch (err) {
        return res.status(401).json({ message: `Token inválido`, error: err.message });
    }
}
