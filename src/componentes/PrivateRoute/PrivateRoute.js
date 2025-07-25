import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" />
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            return <Navigate to="/" />
        }
    } catch (error) {
        console.error("Erro ao decodificar token: ", error);
        localStorage.removeItem('token');
        return <Navigate to="/" />
    }

    return children;
};

export default PrivateRoute;