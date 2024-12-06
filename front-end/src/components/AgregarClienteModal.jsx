import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";

const AgregarClienteModal = ({ open, onClose, handleAddCliente }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        handleAddCliente(formData);
        setFormData({ nombre: "", apellido: "", dni: "", telefono: "" });
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="agregar-cliente-modal"
            aria-describedby="formulario-para-agregar-un-nuevo-cliente"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography id="agregar-cliente-modal" variant="h6" gutterBottom>
                    Agregar Nuevo Cliente
                </Typography>
                <TextField
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name="nombre"
                    label="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    sx={{ marginBottom: "1em" }}
                />
                <TextField
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name="apellido"
                    label="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    sx={{ marginBottom: "1em" }}
                />
                <TextField
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name="dni"
                    label="DNI"
                    value={formData.dni}
                    onChange={handleChange}
                    sx={{ marginBottom: "1em" }}
                />
                <TextField
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name="telefono"
                    label="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    sx={{ marginBottom: "1em" }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                    <Button variant="outlined" onClick={onClose} sx={{ marginRight: "1em" }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AgregarClienteModal;