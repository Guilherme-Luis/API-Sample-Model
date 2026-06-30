import e from "cors";
import authService from "../services/auth.service.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,20}$/;

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name) return res.status(400).json({ message: `Nome é obrigatório` });
        if (!email) return res.status(400).json({ message: `Email é obrigatório` });
        if (!password) return res.status(400).json({ message: `Senha é obrigatória` });

        if (name.length < 4) return res.status(400).json({ message: `Nome deve ter no mínimo 4 caracteres` });
        if (!emailRegex.test(email)) return res.status(400).json({ message: `Email inválido` });
        if (!passwordRegex.test(password)) return res.status(400).json({ message: `Senha deve conter letras e números` });

        const result = await authService.register({ name: name.trim(), email: email.trim().toLowerCase(), password });
        return res.status(201).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: `Email e senha são obrigatórios` });
        if (password.length < 6) return res.status(400).json({ message: `Senha deve ter no mínimo 6 caracteres` });

        const result = await authService.login({ email: email.trim().toLowerCase(), password });
        return res.json(result);

    } catch (error) {
        console.error('💥 LOGIN ERRO TOTAL:', {
            message: error.message,
            stack: error.stack,
            status: error.status
        });
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function logout(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return res.status(401).json({ message: `Token não fornecido` });

        const token = authHeader.split(" ")[1];

        await authService.logout({ token });

        return res.json({ message: `Logout realizado com sucesso` });

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

 const authController = {
    register,
    login,
    logout
 };

 export default authController;
