import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setIsAuthenticated(false);
                setIsChecking(false);
                return;
            }

            // Verificar si el token es válido (opcional)
            try {
                // Aquí podrías agregar lógica para verificar si el token no ha expirado
                // Por ejemplo, decodificar el JWT y verificar la fecha de expiración
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error verificando token:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, []);

    if (isChecking) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh' 
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
