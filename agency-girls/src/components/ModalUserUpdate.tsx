import { Fragment, useState, useEffect } from "react";
import type { User } from "../interfaces/typeUser";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch, TextField, Snackbar, Alert } from "@mui/material";
import { userUpdateServices } from "../services/api/user-services";

interface ModalUserUpdateProps {
    user: User | null;
    open: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
}

export default function ModalUserUpdate({ user, open, onClose, onUserUpdated }: ModalUserUpdateProps) {
    const [snackbar, setSnackbar] = useState<{ open: boolean, severity: 'success' | 'error', message: string }>({
        open: false,
        severity: 'success',
        message: ''
    });

    const [formData, setFormData] = useState<User>({
        id: 0,
        identification: '',
        name: '',
        phoneNumber: '',
        message: '',
        messageCount: 0,
        status: '',
        lastMessage: '',
        isActive: false,
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value } as User);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Actualizando datos:', formData);
        
        try {
            const response = await userUpdateServices({
                id: formData.id,
                identification: formData.identification,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                message: formData.message,
                isActive: formData.isActive,
            });
            
            console.log('Respuesta del servidor:', response);
            
            if (response.success || response.id) {
                setSnackbar({
                    open: true,
                    severity: 'success',
                    message: response.message || 'Usuario actualizado exitosamente',
                });
                onClose();
                onUserUpdated();
            } else {
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: response.message || 'Error al actualizar el usuario',
                });
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            setSnackbar({
                open: true,
                severity: 'error',
                message: error.response?.data?.message || error.message || 'Error al actualizar el usuario',
            });
        }
    }

    return (
        <Fragment>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle sx={{ textAlign: 'center' }} color="primary">
                    Actualizar Usuario
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modifique los datos del usuario
                    </DialogContentText>
                    <form onSubmit={handleSubmit} id="user-update-form">
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="identification"
                            name="identification"
                            label="Identificación"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={formData.identification}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Nombre"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="phoneNumber"
                            name="phoneNumber"
                            label="Teléfono"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            id="message"
                            name="message"
                            label="Mensaje"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={formData.message}
                            onChange={handleChange}
                        />
                        <FormControlLabel
                            label="Activo"
                            control={
                                <Switch 
                                    name="isActive"
                                    checked={formData.isActive} 
                                    onChange={handleChange} 
                                />
                            }
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" form="user-update-form" variant="contained">
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={5000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}
