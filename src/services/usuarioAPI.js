import { HTTPClient } from "./client";

const UsuarioAPI = {
    async listarTiposUsuarioAsync() {
        try {
            const response = await HTTPClient.get(`/Usuario/ListarTiposUsuarios`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar tipos de usuário: ", error);
            throw error;
        }
    },
    async listarTiposGeneroAsync() {
        try {
            const response = await HTTPClient.get(`/Usuario/ListarTiposGeneros`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar tipos de gênero: ", error);
            throw error;
        }
    },
    async criarAsync(nome, email, senha, altura, peso, dataNascimento, genero, tipoUsuario) {
        try {
            const usuarioCriar = {
                Nome: nome,
                Email: email,
                Senha: senha,
                Altura: altura,
                Peso: peso,
                DataNascimento: dataNascimento,
                Genero: genero,
                TipoUsuario: tipoUsuario
            };
            const response = await HTTPClient.post(`/Usuario/NovoUsuario`, usuarioCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar usuário: ", error);
            throw error;
        }
    }
}

export default UsuarioAPI;