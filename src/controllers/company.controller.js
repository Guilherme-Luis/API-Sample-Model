import companyService from "../services/company.service.js";
import { validateCNPJ } from "../utils/documentValidator.js";
import filesService from "../services/files.service.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function list(req, res) {
    try {
        const companies = await companyService.list();
        return res.json(companies);
    } catch (error) {
        //console.error(`Erro ao listar as empresas: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function getById(req, res) {
    try {
        const company = await companyService.getById({ id: req.params.id });
        return res.json(company);
    } catch (error) {
        //console.error(`Erro ao buscar a empresa: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function create(req, res) {
    try {
        const { name, cnpj, email, phone } = req.body;

        let imageId = null;

        if (!name || !cnpj) return res.status(400).json({ message: `Campos obrigatórios ausentes!` });
        if (name.length < 2) return res.status(400).json({ message: `Nome deve ter no mínimo 2 caracteres` });
        if (email && !emailRegex.test(email)) return res.status(400).json({ message: `Email inválido` });
        if (phone && phone.length < 10 || phone.length > 16) return res.status(400).json({ message: `Telefone deve ter DDD e no mínimo 10 dígitos` });
        if (!validateCNPJ(cnpj)) return res.status(400).json({ message: `CNPJ inválido` });
        if (req.file) {
            const allowedTypes = [`image/jpeg`, `image/png`, `image/gif`, `image/jpg`];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ message: `Tipo de arquivo inválido. Apenas imagens JPEG, PNG, JPG e GIF são permitidas.` });
            }

            const file = await filesService.upload({
                userId: req.user.id,
                file: req.file
            });
            imageId = file.id;
        }

        const company = await companyService.create({
            name: name.trim(),
            cnpj,
            email,
            phone,
            imageId
        });
        return res.status(201).json({ message: `Empresa criada com sucesso: `, company });
    } catch (error) {
        //console.error(`Erro ao criar empresa: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function update(req, res) {
    try {
        const { name, cnpj, email, phone } = req.body;

        const data = {};

        if (name !== undefined) {
            if (name.length < 2) return res.status(400).json({ message: `Nome deve ter no mínimo 2 caracteres` });
            data.name = name.trim();
        }
        if (cnpj !== undefined) {
            if (!validateCNPJ(cnpj)) return res.status(400).json({ message: `CNPJ inválido` });
            data.cnpj = cnpj;
        }
        if (email !== undefined) {
            if (email && !emailRegex.test(email)) return res.status(400).json({ message: `Email inválido` });
            data.email = email;
        }
        if (phone !== undefined) {
            if (phone && phone.length < 10) return res.status(400).json({ message: `Telefone deve ter DDD e no mínimo 10 dígitos` });
            data.phone = phone;
        }
        if (req.file) {
            const allowedTypes = [`image/jpeg`, `image/png`, `image/gif`, `image/jpg`];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ message: `Tipo de arquivo inválido. Apenas imagens JPEG, PNG e GIF são permitidas.` });
            }

            const file = await filesService.upload({
                userId: req.user.id,
                file: req.file
            });
            data.imageId = file.id;
        }



        const updated = await companyService.update({ id: req.params.id, data: data });

        return res.json({ message: `Empresa atualizada com sucesso: `, updated });
    } catch (error) {
        //console.error(`Erro ao atualizar a empresa: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function deleteCompany(req, res) {
    try {
        await companyService.deleteCompany({ id: req.params.id });
        return res.status(204).send();
    } catch (error) {
        //console.error(`Erro ao tentar excluir a empresa: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

const companyController = {
    list,
    getById,
    create,
    update,
    deleteCompany
}

export default companyController;