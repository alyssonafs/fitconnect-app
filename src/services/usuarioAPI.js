import { HTTPClient } from "./client";

const UsuarioAPI = {
    async obterAsync(usuarioId) {
        try {
            const response = await HTTPClient.get(`/Usuario/Obter/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter usuário: ", error);
            throw error;
        }
    },
    async obterPorEmailAsync(email) {
        try {
            const response = await HTTPClient.get(`/Usuario/ObterPorEmail/${email}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter usuário: ", error);
            throw error;
        }
    },
    async listarUsuariosAsync(ativos = true) {
        try {
            const response = await HTTPClient.get(`/Usuario/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar os usuários: ", error);
            throw error;
        }
    },
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
    },
    async atualizarAsync(id, nome, email, altura, peso, dataNascimento, genero, tipoUsuario) {
        try {
            const usuarioAtualizar = {
                Id: id,
                Nome: nome,
                Email: email,
                Altura: altura,
                Peso: peso,
                DataNascimento: dataNascimento,
                Genero: genero,
                TipoUsuario: tipoUsuario
            };
            const response = await HTTPClient.put(`/Usuario/Atualizar`, usuarioAtualizar);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar usuário: ", error);
            throw error;
        }
    }
}

export default UsuarioAPI;