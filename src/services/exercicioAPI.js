import { HTTPClient } from "./client";

const ExercicioAPI = {
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Exercicio/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar exercícios: ", error);
            throw error;
        }
    },
    async listarTiposGruposMuscularesAsync(){
        try {
            const response = await HTTPClient.get(`/Exercicio/ListarTiposGruposMusculares`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar tipos de grupos musculares: ", error);
            throw error;
        }
    }
}

export default ExercicioAPI;