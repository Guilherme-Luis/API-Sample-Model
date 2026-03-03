import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_SECRET, AUTH_EXPIRES } = process.env;

async function register({ name, email, password }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        const error = new Error(`Email já cadastrado`);
        error.status = 400;
        throw error;
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: AUTH_EXPIRES }
    );

    return { token };
}

async function login({ email, password }) {

    // Validar usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error(`Credenciais inválidas`);
        error.status = 401;
        throw error;
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
        const error = new Error(`Credenciais inválidas`);
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: AUTH_EXPIRES }
    );

    return { token };
}

async function logout({ token }) {
    if (!token) {
        const error = new Error(`Token não fornecido`);
        error.status = 401;
        throw error;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        await prisma.blacklistedToken.create({
            data: {
                token,
                expiresAt: new Date(decoded.exp * 1000)
            }
        });
    } catch (err) {
        const error = new Error(`Token inválido ou expirado`);
        error.status = 401;
        throw error;
    }
}

export default {
    register,
    login,
    logout
}