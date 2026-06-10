import { useState, useEffect } from 'react'
import type { User } from "../interfaces/typeUser";
import ModalUserCreate from './ModalUserCreate';
import ModalUserUpdate from './ModalUserUpdate';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TablePagination, useTheme, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { userDeleteServices, userGetAllServices, userResetCountServices } from '../services/api/user-services';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RestoreFromTrash } from '@mui/icons-material';
import { Alert } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export function User() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, identification: string | null }>({
        open: false,
        identification: null
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setOpen(false);
        fetchUsers(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchUsers = async (currentPage: number, limit: number) => {
        setLoading(true);
        try {
            const response = await userGetAllServices(currentPage, limit);
            console.log('API Response:', response);

            // Esperamos una respuesta con estructura de paginación: { users: [...], total: 100 }
            if (response.users && Array.isArray(response.users)) {
                setUsers(response.users);
            } else if (Array.isArray(response)) {
                // Si la respuesta es un array directo
                setUsers(response);
            } else if (response.data && Array.isArray(response.data)) {
                setUsers(response.data);
               
            } else {
                console.error('Formato de respuesta no reconocido:', response);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = (userData: User) => {
        setSelectedUser(userData);
        setOpenUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
        setSelectedUser(null);
    };

    const handleOpenDeleteDialog = (identification: string) => {
        setDeleteDialog({ open: true, identification });
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, identification: null });
    };

    const handleDeleteUser = async () => {
        if (deleteDialog.identification === null) return;

        try {
            await userDeleteServices(deleteDialog.identification);
            // Recargar la página actual
            fetchUsers(page + 1, rowsPerPage);
            handleCloseDeleteDialog();
        } catch (error) {
            setError(error);
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        if (page === newPage) {
            setPage(newPage + 1);
        } else {
            setPage(newPage);
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        fetchUsers(1, newRowsPerPage);
    };

    const refetchUsers = () => {
        setPage(0);
        fetchUsers(1, rowsPerPage);
    };

    const resetCounter = async () => {
        try {
            const response = await userResetCountServices();
            setOpen(true);
            setAlertMessage(response.message);
            fetchUsers(1, rowsPerPage);
        } catch (error) {
            setAlertMessage( 'Error al reiniciar el contador');
            setOpen(true);
            fetchUsers(1, rowsPerPage);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, backgroundColor: '#fff3cd', borderRadius: 2, border: '1px solid #ffc107' }}>
                <Typography color="error">Error: {error.message}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
            padding: { xs: 1, sm: 2, md: 3 }
        }}>
            <Paper
                elevation={3}
                sx={{
                    padding: { xs: 1.5, sm: 2, md: 3 },
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    overflowX: 'auto'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    marginBottom: 3,
                    paddingBottom: 2,
                    borderBottom: '2px solid #e0e0e0',
                    gap: 2
                }}>

                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 600,
                            color: '#1976d2',
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                        }}
                    >
                        Lista de Usuarios
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 1, sm: 2 },
                        flexWrap: 'wrap',
                        justifyContent: { xs: 'center', md: 'flex-end' }
                    }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={!isMobile && <RestoreFromTrash />}
                            onClick={() => resetCounter()}
                            size={isMobile ? 'small' : 'medium'}
                            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                        >
                            {isMobile ? 'Reiniciar' : 'Reiniciar Contador'}
                        </Button>
                        <ModalUserCreate onUserCreated={refetchUsers} />
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={!isMobile && <LogoutIcon />}
                            onClick={handleLogout}
                            size={isMobile ? 'small' : 'medium'}
                            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                        >
                            {isMobile ? 'Salir' : 'Cerrar Sesión'}
                        </Button>
                    </Box>
                </Box>

                {users.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        padding: 5,
                        backgroundColor: '#f9f9f9',
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" color="textSecondary">
                            No hay usuarios registrados
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    {!isMobile && <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>ID</TableCell>}
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Identificación</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Nombre</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Teléfono</TableCell>
                                    {!isMobile && <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Mensaje</TableCell>}
                                    {!isTablet && <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Último Mensaje</TableCell>}
                                    {!isTablet && <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Contador</TableCell>}
                                    {!isTablet && <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Estado</TableCell>}
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user: User) => (
                                    <TableRow
                                        key={user.id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                                transition: 'background-color 0.3s'
                                            },
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        {!isMobile && <TableCell>{user.id}</TableCell>}
                                        <TableCell>{user.identification}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        {!isMobile && <TableCell>{user.message}</TableCell>}
                                        {!isTablet && <TableCell>{user.lastMessage}</TableCell>}
                                        {!isTablet && <TableCell align="center">{user.messageCount}</TableCell>}
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    backgroundColor: user.isActive ? '#d4edda' : '#f8d7da',
                                                    color: user.isActive ? '#155724' : '#721c24'
                                                }}
                                            >
                                                {user.isActive ? 'Activo' : 'Inactivo'}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, justifyContent: 'center' }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleUpdateUser(user)}
                                                    size={isMobile ? 'small' : 'medium'}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                                        }
                                                    }}
                                                >
                                                    <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleOpenDeleteDialog(user.identification)}
                                                    size={isMobile ? 'small' : 'medium'}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(211, 47, 47, 0.08)'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <TablePagination
                    component="div"
                    count={20}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={isMobile ? [10, 20] : [10, 20, 50, 100]}
                    labelRowsPerPage={isMobile ? '' : 'Usuarios por página:'}
                    labelDisplayedRows={({ from, to, count }) =>
                        isMobile ? `${from}-${to} de ${count}` : `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                    sx={{
                        '.MuiTablePagination-toolbar': {
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            padding: { xs: '8px', sm: '16px' }
                        },
                        '.MuiTablePagination-selectLabel': {
                            margin: { xs: 0, sm: 'auto' }
                        },
                        '.MuiTablePagination-displayedRows': {
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }
                    }}
                />

            </Paper>

            <ModalUserUpdate
                user={selectedUser}
                open={openUpdateModal}
                onClose={handleCloseUpdateModal}
                onUserUpdated={refetchUsers}
            />

            <Dialog
                open={deleteDialog.open}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDeleteUser} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ width: '100%' }}>
                <Collapse in={open}>
                    <Alert
                        severity="success"
                        variant="filled"
                        
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        {alertMessage}
                    </Alert>
                </Collapse>
            </Box>
        </Box>
    )
}
