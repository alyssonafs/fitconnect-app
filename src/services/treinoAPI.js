import { HTTPClient } from "./client";

const TreinoAPI = {
    async obterAsync(treinoId) {
        try {
            const response = await HTTPClient.get(`/Treino/Obter/${treinoId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter treino: ", error);
            throw error;
        }
    },
    async criarAsync(nome, personalId) {
        try {
            const treinoCriar = {
                Nome: nome,
                PersonalId: personalId
            };
            const response = await HTTPClient.post(`/Treino/NovoTreino`, treinoCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar treino: ", error);
            throw error;
        }
    },
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Treino/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar treinos: ", error);
            throw error;
        }
    },
    async listarTreinosPerosnalAsync(personalId) {
        try {
            const response = await HTTPClient.get(`/Treino/Listar/Personal?personalId=${personalId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar treinos do personal: ", error);
            throw error;
        }
    },
    async listarTreinosAlunoAsync(alunoId) {
        try {
            const response = await HTTPClient.get(`/TreinoCompartilhado/Listar/Aluno?alunoId=${alunoId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar treinos do aluno: ", error);
            throw error;
        }
    },
    async atualizarAsync(id, nome) {
        try {
            const treinoAtualizar = {
                Id: id,
                Nome: nome,
            };
            const response = await HTTPClient.put(`/Treino/Atualizar`, treinoAtualizar);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar treino: ", error);
            throw error;
        }
    },
    async deletarAsync(treinoId) {
        try {
            const response = await HTTPClient.delete(`/Treino/Deletar/${treinoId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar treino: ", error);
            throw error;
        }
    },
    async compartilharTreinoAsync(treinoId, alunoId) {
        try {
            const compartilharTreino = {
                TreinoId: treinoId,
                AlunoId: alunoId
            };
            const response = await HTTPClient.post(`/TreinoCompartilhado/NovoTreinoCompartilhado`, compartilharTreino);
            return response.data;
        } catch (error) {
            console.error("Erro ao compartilhar treino: ", error);
            throw error;
        }

    },
    async adicionarExericio(treinoId, exercicioId, serie) {
        try {
            const exercicioTreino = {
                Serie: serie,
                TreinoId: treinoId,
                ExercicioId: exercicioId
            };
            const response = await HTTPClient.post(`/ExercicioTreino/NovoExercicioTreino`, exercicioTreino);
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar exercício ao treino: ", error);
            throw error;
        }
    },
    async removerExercicioAsync(exercicioTreinoId) {
        try {
            const response = await HTTPClient.delete(`/ExercicioTreino/Deletar/${exercicioTreinoId}`
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao remover exercício do treino:", error);
            throw error;
        }
    },
    async listarPorGrupoMuscularAsync(grupoMuscularId) {
        try {
            const response = await HTTPClient.get(`/Treino/ListarPorGrupoMuscular?grupoMuscular=${grupoMuscularId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar por grupo muscular:", error);
            throw error;
        }
    },

    async gerarTreinoIaAsync(personalId, usuarioId, gruposMusculares, objetivo) {
        try {
            const response = await HTTPClient.post('/Treino/GerarTreinoIa', {
                personalId,
                usuarioId,
                gruposMusculares,
                objetivo
            });

            return response.data;
        } catch (error) {
            console.error("Erro ao criar treino pela IA:", error);
            throw error;
        }
    }
}

export default TreinoAPI;