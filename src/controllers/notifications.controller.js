import notificationService from "../services/notification.service.js";

const VALID_TYPES = [`EMAIL`, `SMS`, `PUSH`, `SYSTEM`, `ALERT`];

export async function list(req, res) {
    try {
        const result = await notificationService.list({ userId: req.user.id });

        return res.json(result);
    } catch (error) {
        //console.error(`Erro ao listar notificações: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function create(req, res) {
    try {
        const { title, message, type = `SYSTEM` } = req.body;

        if (!title || !message) return res.status(400).json({ message: `Título e mensagem são obrigatórios` });
        if (title.length < 3 || title.length > 100) return res.status(400).json({ message: `Título deve conter entre 3 e 100 caracteres` });
        if (!VALID_TYPES.includes(type)) return res.status(400).json({ message: `Tipo de notificação inválido` });
        if (message.length > 1000) return res.status(400).json({ message: `Mensagem deve conter no máximo 1000 caracteres` });

        const result = await notificationService.create({
            userId: req.user.id,
            title: title.trim(),
            message: message.trim(),
            type
        });

        return res.status(201).json(result);
    } catch (error) {
        //console.error(`Erro ao criar notificação: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function markAsRead(req, res) {
    try {
        const result = await notificationService.markAsRead({ id: req.params.id, userId: req.user.id });

        if (!result) return res.status(404).json({ message: `Notificação não encontrada` });

        return res.json({ message: `Notificação marcada como lida` });
    } catch (error) {
        //console.error(`Erro ao marcar notificação como lida: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function update(req, res) {
    try {
        const { title, message, type } = req.body;
        const data = {};

        if (title) {
            if (title.length < 3 || title.length > 100) return res.status(400).json({ message: `Título deve conter entre 3 e 100 caracteres` });
            data.title = title.trim();
        }
        if (message) {
            if (message.length < 10 || message.length > 1000) return res.status(400).json({ message: `Mensagem deve conter entre 10 e 1000 caracteres` });
            data.message = message.trim();
        }

        if (type) {
            if (!VALID_TYPES.includes(type)) return res.status(400).json({ message: `Tipo de notificação inválido` });
            data.type = type;
        }

        const notification = await notificationService.update({
            id: req.params.id,
            userId: req.user.id,
            data
        });

        if (!notification) return res.status(403).json({ message: `Acesso negado` });

        return res.json({ message: `Notificação atualizada com sucesso`, notification });
    } catch (error) {
        //console.error(`Erro ao atualizar notificação: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function deleteNotification(req, res) {
    try {
        const deleted = await notificationService.deleteNotification({ id: req.params.id, userId: req.user.id });

        if (!deleted) {
            return res.status(404).json({ message: `Notificação não encontrada` });
        }

        return res.json({ message: `Notificação excluída com sucesso!` });
    } catch (error) {
        //console.error(`Erro ao excluir notificação: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

const notificationsController = {
    list,
    create,
    markAsRead,
    update,
    deleteNotification
}

export default notificationsController;