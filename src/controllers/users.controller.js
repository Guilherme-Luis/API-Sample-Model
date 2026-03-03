import usersService from "../services/users.service.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function list(req, res) {
    try {
        const users = await usersService.list();

        return res.json(users);

    } catch (error) {
        //console.error(`Erro ao listar usuários: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

async function getById(req, res) {
    try {
        const user = await usersService.getById({ id: req.params.id });

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        return res.json(user);

    } catch (error) {
        //console.error(`Erro ao buscar usuário: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

async function update(req, res) {
    try {

        const { name, email } = req.body;

        const data = {}

        if (name !== undefined) {
            if (typeof name !== `string` || name.trim().length < 4) return res.status(400).json({ message: `Nome deve ter no mínimo 4 caracteres` });
            data.name = name.trim();
        }
        if (email !== undefined) {
            if (typeof email !== `string` || !emailRegex.test(email)) return res.status(400).json({ message: `Email inválido` });
            data.email = email.trim().toLowerCase();
        }
        if (Object.keys(data).length === 0) return res.status(400).json({ message: `Nenhum campo para atualizar` });

        const updated = await usersService.update({id: req.params.id, data });

        return res.json(updated);
    } catch (error) {
        //console.error(`Erro ao atualizar usuário: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

async function deleteUser(req, res) {
    try {
        const deleted = await usersService.deleteUser({ id: req.params.id });

        if (!deleted) return res.status(404).json({ message: "Usuário não encontrado" });

        return res.json({ message: "Usuário deletado com sucesso" });

    } catch (error) {
        //console.error(`Erro ao deletar usuário: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

async function changeRole(req, res) {
    try {
        const { role } = req.body;

        if(!role || typeof role !== `string`) return res.status(400).json({ message: `Role é obrigatória e deve ser válida` });

        const updated  = await usersService.changeRole({ id: req.params.id, role: req.body.role.trim().toUpperCase() });
        
        if (!updated) return res.status(404).json({ message: "Usuário não encontrado" });

        return res.json(updated);

    } catch (error) {
        if (error.message === `INVALID_ROLE`) return res.status(400).json({ message: `Usuário não possui permissão` });
        
        //console.error(`Erro ao alterar role do usuário: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

const usersController = {
    list,
    getById,
    update,
    deleteUser,
    changeRole
};

export default usersController;