import classifierService from "../services/classifier.service.js";

export async function list(req, res) {
    try {

    } catch (error) {
        //console.error(`Erro ao listar as classificações: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function create(req, res) {
    try {

    } catch (error) {
        //console.error(`Erro ao criar as classificações: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function update(req, res) {
    try {

    } catch (error) {
        //console.error(`Erro ao atualizar a classificação: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

export async function deleteClassified(req, res) {
    try {

    } catch (error) {
        //console.error(`Erro ao tentar excluir a classificação: `, error);
        return res.status(error.status || 500).json({ message: error.status ? error.message: `Erro interno do servidor` });
    }
}

const classifierController = {
    list,
    create,
    update,
    deleteClassified
}

export default classifierController;