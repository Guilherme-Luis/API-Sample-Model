import productsService from "../services/products.service.js";
import filesService from "../services/files.service.js";

async function list(req, res) {
    try {
        const products = await productsService.list();

        return res.json(products);
    } catch (error) {
        //console.error(`Erro ao listar produtos: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

async function getById(req, res) {
    try {
        const product = await productsService.getById({ id: req.params.id });

        if (!product) return res.status(404).json({ message: `Produto não encontrado` });

        return res.json(product);
    } catch (error) {
        //console.error(`Erro ao buscar produto: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

async function create(req, res) {
    try {
        const { name, description, price, stock } = req.body;

        let imageId = null;

        if (!name || name.trim().length < 3) return res.status(400).json({ message: `O nome do produto é obrigatório e deve conter pelo menos 3 caracteres` }); 
        if (!description || description.trim().length < 5) return res.status(400).json({ message: `A descrição do produto é obrigatória e deve conter pelo menos 5 caracteres` });
        if (isNaN(Number(price)) || price <= 0) return res.status(400).json({ message: `O preço do produto é obrigatório` });
        if (!Number.isInteger(Number(stock)) || stock < 0) return res.status(400).json({ message: `O estoque do produto é obrigatório` });
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

        const product = await productsService.create({
            data: {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                stock: Number(stock),
                imageId
            }
        });

        return res.status(201).json({ message: `Produto criado com sucesso: `, product });
    } catch (error) {
        //console.error(`Erro ao criar produto: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

async function update(req, res) {
    try {
        const { name, description, price, stock } = req.body;

        const data = {};

        if (name !== undefined) {
            if (name.trim().length < 3) return res.status(400).json({ message: `O nome do produto deve conter pelo menos 3 caracteres` });
            data.name = name.trim();
        }
        if (description !== undefined) {
            data.description = description.trim();
        }
        if (price !== undefined) {
            if (isNaN(Number(price)) || price <= 0) return res.status(400).json({ message: `O preço do produto deve ser um valor válido` });
            data.price = Number(price);
        }
        if (stock !== undefined) {
            if (!Number.isInteger(Number(stock)) || stock < 0) return res.status(400).json({ message: `O estoque do produto deve ser um valor inteiro e válido` });
            data.stock = Number(stock);
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
        if (Object.keys(data).length === 0) return res.status(400).json({ message: `Nenhum campo para atualizar` });

        const updated = await productsService.update({ id: req.params.id, data });

        if (!updated) return res.status(404).json({ message: `Produto não encontrado` });

        return res.json(updated);
    } catch (error) {
        //console.error(`Erro ao atualizar produto: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

async function toggleActive(req, res) {
    try {
        const updated = await productsService.toggleActive({ id: req.params.id });
        
        if (!updated) return res.status(404).json({ message: `Produto não encontrado` });

        return res.json(updated);
    } catch (error) {
        //console.error(`Erro ao alternar status do produto: ${error.message}`);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

const productsController = {
    list,
    getById,
    create,
    update,
    toggleActive
};

export default productsController;