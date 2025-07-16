// src/routes/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function isTokenValid(token) {
    try {
        const { exp } = jwtDecode(token);
        return Date.now() < exp * 1000;
    } catch {
        return false;
    }
}

export default function PublicRoute({ children }) {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}
