import { Fragment, useState } from "react";
import type { UserCreate } from "../interfaces/typeUser";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch, TextField, Snackbar, Alert } from "@mui/material";
import { userCreateServices } from "../services/api/user-services";

interface ModalUserCreateProps {
    onUserCreated: () => void;
    snackbarMessage?: string;
}

export default function ModalUserCreate({ onUserCreated, snackbarMessage = 'Usuario creado exitosamente' }: ModalUserCreateProps) {
    const [open, setOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, severity: 'success' | 'error', variant: string, message: string }>({
        open: false,
        severity: 'success',
        variant: 'filled',
        message: 'Se Guardo el usuario correctamente'
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [formData, setFormData] = useState<UserCreate>({
        identification: '',
        name: '',
        phoneNumber: '',
        message: '',
        isActive: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value } as UserCreate);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Enviando datos:', formData);
        
        try {
            const response = await userCreateServices(formData);
            console.log('Respuesta del servidor:', response);
            
            if (response.success || response.id) {
                setSnackbar({
                    open: true,
                    severity: 'success',
                    variant: 'filled',
                    message: response.message || snackbarMessage,
                });
                setFormData({
                    identification: '',
                    name: '',
                    phoneNumber: '',
                    message: '',
                    isActive: false,
                });
                handleClose();
                onUserCreated();
            } else {
                setSnackbar({
                    open: true,
                    severity: 'error',
                    variant: 'filled',
                    message: response.message || 'Error al crear el usuario',
                });
            }
        } catch (error: any) {
            console.error('Error creating user:', error);
            setSnackbar({
                open: true,
                severity: 'error',
                variant: 'filled',
                message: error.response?.data?.message || error.message || 'Error al crear el usuario',
            });
        }
    }
    return (
        <Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Crear usuario
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: 'center' }} color="primary">
                    Creacion de usuario
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Por favor ingrese los datos del usuario
                    </DialogContentText>
                    <form onSubmit={handleSubmit} id="user-create-form">
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="identification"
                            name="identification"
                            label="Identification"
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
                            label="Name"
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
                            label="Phone Number"
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
                            label="Message"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={formData.message}
                            onChange={handleChange}
                        />
                        <FormControlLabel
                            label="Is Active"
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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" form="user-create-form">
                        Guardar
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
                    variant={snackbar.variant as 'filled' | 'outlined' | 'standard'}
                    sx={{ width: '100%', textAlign: 'center' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}
