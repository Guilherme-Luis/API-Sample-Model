import ordersService from "../services/orders.service.js";

export async function cancel(req, res) {
    try {
        if (!req.params.id) return res.status(400).json({ message: `ID do pedido é obrigatório` });

        await ordersService.cancel({ id: req.params.id, userId: req.user.userId, role: req.user.role });

        return res.json({ message: `Pedido cancelado com sucesso` });
    } catch (error) {
        //console.error(`Erro ao cancelar pedido: `, error);

        if (error.message === `NOT_FOUND`) return res.status(404).json({ message: `Pedido não encontrado` });
        if (error.message === `FORBIDDEN`) return res.status(403).json({ message: `Acesso negado` });
        if(error.message === `INVALID_STATUS`) return res.status(400).json({ message: `Apenas pedidos pendentes podem ser cancelados` });

        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function updateStatus(req, res) {
    try {
        const { status } = req.body;

        if (!status || typeof status !== `string`) return res.status(400).json({ message: `Status do pedido é obrigatório` });

        await ordersService.updateStatus({ id: req.params.id, status: req.body.status });

        return res.json({ message: `Status do pedido atualizado com sucesso` });
    } catch (error) {
        //console.error(`Erro ao atualizar status do pedido: `, error);

        if (error.message === `NOT_FOUND`) return res.status(404).json({ message: `Pedido não encontrado` });
        if(error.message === `INVALID_STATUS`) return res.status(400).json({ message: `Status inválido` });
        
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function summary(req, res) {
    try {
        const result = await ordersService.summary({ userId: req.user.userId, role: req.user.role });

        return res.json(result);
    } catch (error) {
        //console.error(`Erro ao obter resumo de pedidos: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
    
}

export async function create(req, res) {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: `Itens do pedido são obrigatórios` });

        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity <= 0) return res.status(400).json({ message: `Cada item deve ser associado a um produto e quantidade válidos` });
        }
        const order = await ordersService.create({ userId: req.user.id, items: req.body.items });

        return res.status(201).json(order); 
    } catch (error) {
        //console.error(`Erro ao criar pedido: `, error);

        if (error.message === `INVALID_ITEMS`) return res.status(400).json({ message: `Itens do pedido são obrigatórios` });
        if (error.message === `PRODUCT_NOT_FOUND`) return res.status(400).json({ message: `Produto Inválido` });
        if (error.message === `INSUFFICIENT_STOCK`) return res.status(400).json({ message: `Estoque insuficiente` });

        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

const ordersController = {
    cancel,
    updateStatus,
    summary,
    create
};

export default ordersController;