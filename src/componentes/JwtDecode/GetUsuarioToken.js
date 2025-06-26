import { jwtDecode } from 'jwt-decode';

export function GetUsuarioToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return null;
    }
}

export default GetUsuarioToken;