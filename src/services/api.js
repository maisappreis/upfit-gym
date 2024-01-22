import axios from "axios";

// const database = "/db.json";
const database = "/db_test.json";
const apiUrl = "http://localhost:3001";

export const fetchData = async () => {
    try {
        console.log('Requisitando os dados...')
        const response = await axios.get(database);
        return response.data;
    } catch (error) {
        console.error('Erro ao requisitar os dados...', error);
        throw error;
    }
};

export const postData = async (entity, newData) => {
    try {
        console.log('Salvando os dados...', newData)
        const response = await axios.post(`${apiUrl}/${entity}`, newData);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar os dados...', error);
        throw error;
    }
};

export const updateData = async (id, entity, updatedData) => {
    try {
        console.log('Atualizando os dados...', updatedData)
        const response = await axios.patch(`${apiUrl}/${entity}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar os dados...', error);
        throw error;
    }
};

export const deleteData = async (id, entity) => {
    try {
        console.log('Deletando os dados...')
        const response = await axios.delete(`${apiUrl}/${entity}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar os dados...', error);
        throw error;
    }
};