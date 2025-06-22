import axios from 'axios';

const api = axios.create({
    baseURL: "https://localhost:7132",
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Content-Type": "application/json;charset-UTF-8",
    }
})

const authAPI = {
    async loginAsync(email, senha) {
        try {
            const response = await api.post(`/auth/login`, { email, senha });
            const token = response.data.token;

            localStorage.setItem('token', token);

            return token;
        } catch (error) {
            console.error("Erro ao fazer login:", error.response ? error.response.data : error);
            throw error;
        }
    },

    async logoutAsync() {
        localStorage.removeItem('token');
    },

    async solicitarRecuperacao(email) {

        try {
            const response = await api.post(`/auth/solicitar-recuperacao`, { email });

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar email:", error.response ? error.response.data : error);
            throw error;
        }

    },

    async redefinirSenha(email, novaSenha, confirmarSenha) {
        try {
            const response = await api.put(`/auth/redefinir-senha`, {email, novaSenha, confirmarSenha});

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar email:", error.response ? error.response.data : error);
            throw error;
        }
    }
};

export default authAPI;