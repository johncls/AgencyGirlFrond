import { useState } from "react";
import { apiUrl } from "../config";
import { Box, Button, Card, CardContent, TextField, Typography, InputAdornment, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

export default function UserLogin() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const loginData = {
        identification: '',
        password: '',
    }
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<typeof loginData>(loginData);

    async function login(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${apiUrl}/api/UserLogin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                authLogin(data.token);
                navigate('/users', { replace: true });
            } else {
                setError(data.message || 'Error en el login');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
                padding: 2,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(184, 134, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(220, 20, 60, 0.08) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: '30%',
                    borderRadius: 4,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(184, 134, 11, 0.15)',
                    overflow: 'visible',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(184, 134, 11, 0.2)',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'white',
                        borderBottom: '2px solid rgba(184, 134, 11, 0.3)',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                            boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                        }
                    }}
                >
                    <Box
                        sx={{
                            width: 70,
                            height: 70,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 2,
                            border: '2px solid rgba(212, 175, 55, 0.3)',
                            boxShadow: '0 0 20px rgba(212, 175, 55, 0.2), inset 0 0 20px rgba(184, 134, 11, 0.1)'
                        }}
                    >
                        <LockOutlinedIcon sx={{ fontSize: 40, color: '#d4af37' }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#d4af37', textShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}>
                        Bienvenido
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, marginTop: 1, color: '#cccccc' }}>
                        Ingresa tus credenciales para continuar
                    </Typography>
                </Box>

                <CardContent sx={{ padding: 4, backgroundColor: '#1a1a1a' }}>
                    <form onSubmit={login}>
                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            id="identification"
                            type="text"
                            name="identification"
                            label="Usuario / Identificación"
                            value={userData.identification}
                            onChange={handleChange}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlinedIcon sx={{ color: '#d4af37' }} />
                                        </InputAdornment>
                                    ),
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#0f0f0f',
                                    color: '#ffffff',
                                    '& fieldset': {
                                        borderColor: 'rgba(184, 134, 11, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(212, 175, 55, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d4af37',
                                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#999999',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#d4af37',
                                }
                            }}
                        />
                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            id="password"
                            type="password"
                            name="password"
                            label="Contraseña"
                            value={userData.password}
                            onChange={handleChange}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: '#d4af37' }} />
                                        </InputAdornment>
                                    ),
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#0f0f0f',
                                    color: '#ffffff',
                                    '& fieldset': {
                                        borderColor: 'rgba(184, 134, 11, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(212, 175, 55, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d4af37',
                                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#999999',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#d4af37',
                                },
                                marginBottom: 3
                            }}
                        />

                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    marginBottom: 2, 
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(220, 20, 60, 0.15)',
                                    color: '#ff6b6b',
                                    border: '1px solid rgba(220, 20, 60, 0.3)',
                                    '& .MuiAlert-icon': {
                                        color: '#dc143c'
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            variant="contained"
                            size="large"
                            sx={{
                                borderRadius: 2,
                                padding: 1.5,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #b8860b 100%)',
                                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4), 0 0 20px rgba(184, 134, 11, 0.2)',
                                color: '#000000',
                                border: '1px solid rgba(212, 175, 55, 0.5)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
                                    boxShadow: '0 6px 20px rgba(212, 175, 55, 0.6), 0 0 30px rgba(212, 175, 55, 0.3)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(135deg, #666666 0%, #888888 50%, #666666 100%)',
                                    color: '#333333',
                                    boxShadow: 'none'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}
