import filesService from "../services/files.service.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [ `application/pdf`, `text/plain`, `application/msword`,
    `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
    `image/jpeg`, `image/png`, `image/gif`, `image/jpg` ];


export async function upload(req, res) {
    try {
        if (!req.file) return res.status(400).json({ message: `Nenhum arquivo enviado` });
        if (req.file.size > MAX_FILE_SIZE) return res.status(400).json({ message: `Arquivo excede o tamanho máximo de 10MB` });
        if (!ALLOWED_TYPES.includes(req.file.mimetype)) return res.status(400).json({ message: `Tipo de arquivo não permitido` });

        const file = await filesService.upload({ userId: req.user.id, file: req.file });
        
        return res.status(201).json({ message: `Arquivo enviado com sucesso`, file });
    } catch (error) {
        //console.error(`Erro ao enviar arquivo: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function list(req, res) {
    try {
        const files = await filesService.list();
        return res.json(files);

    } catch (error) {
        //console.error(`Erro ao listar arquivos: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function getById(req, res) {
    try {
        const file = await filesService.getById({ id: req.params.id });
        return res.json(file);

    } catch (error) {
        //console.error(`Arquivo não encontrado: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function deleteFiles(req, res) {
    try {
        await filesService.deleteFiles({ id: req.params.id });

        return res.json({ message: `Arquivo removido com sucesso` });

    } catch (error) {
        //console.error(`Erro ao deletar arquivo: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function download(req, res) {
    try {
        const file = await filesService.download({ id: req.params.id });
        return res.download(file.path, file.originalName);
        
    } catch (error) {
        //console.error(`Erro ao baixar arquivo: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

const filesController = {
    upload,
    list,
    getById,
    deleteFiles,
    download
}

export default filesController;