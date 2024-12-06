import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHabitacionByNumero, patchHabitacion } from "../services/api";
import "../styles/Habitacion.css";
import {
  Box,
  Grid2,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Modal,
  IconButton,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';


const Habitacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habitacion, setHabitacion] = useState();
  const [insumos, setInsumos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newInsumo, setNewInsumo] = useState({ nombre: "", cantidad: "" });

  console.log(id);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewInsumo({ nombre: "", cantidad: "" });
  };

  const handleAddInsumo = () => {
    if (newInsumo.nombre.trim() && newInsumo.cantidad > 0) {
      setInsumos([...insumos, newInsumo]);
      handleCloseModal();
    }
  };

  const handleDeleteInsumo = (index) => {
    setInsumos(insumos.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    console.log("Insumos confirmados:", insumos);
  };

  const handleStatusChange = async (estado) => {
    patchHabitacion(habitacion.id, estado);
    getHabitacionByNumero(id).then((res) => setHabitacion(res));
  };

  useEffect(() => {
    getHabitacionByNumero(id).then((res) => setHabitacion(res));
  }, [])

  if (!habitacion) return <p>Cargando...</p>;

  return (
    <Box sx={{ padding: 3 }}>
      <Grid2 container spacing={3}>
        <Grid2 size={4} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                Habitación {habitacion.numero}
              </Typography>
              <Typography variant="body1">
                Capacidad: <strong>{habitacion.capacidad}</strong>
              </Typography>
              <Typography variant="body1">
                Precio: $<strong>{habitacion.precio}</strong>
              </Typography>
              <Typography variant="body1">
                N° reserva actual: <strong>{habitacion.reservas[0]?.id}</strong>
              </Typography>
              <Typography variant="body1">
                Check in reserva actual: <strong>{habitacion.reservas[0]?.check_in}</strong>
              </Typography>
              <Typography variant="body1">
                Check Out reserva actual: <strong>{habitacion.reservas[0]?.check_out}</strong>
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ mt: "2em" }}>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom sx={{ mb: "1em" }}>
                Estado: {habitacion.estado}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleStatusChange("Disponible")}
                >
                  Marcar Disponible
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleStatusChange("Pendiente")}
                >
                  Marcar en Mantenimiento
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={4} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Próximas Reservas
              </Typography>
              <List>
                {habitacion.reservas?.map((reserva) => (
                  <div key={reserva.id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => navigate(`/reservas/${reserva.rsv_ID}`)}
                        >
                          Ver
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={`Reserva N°${reserva.id}`}
                        secondary={`Check-in: ${reserva.check_in} | Check-out: ${reserva.check_out}`}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={4} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Insumos
              </Typography>
              <List>
                {insumos.map((insumo, index) => (
                  <div key={index}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteInsumo(index)}
                        >
                          <ClearIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={insumo.nombre}
                        secondary={`Cantidad: ${insumo.cantidad}`}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
              <Box sx={{ textAlign: "right", marginTop: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirm}
                  disabled={insumos.length === 0}
                  sx={{ mr: "1em" }}
                >
                  Confirmar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Agregar Insumos
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 300,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Agregar Insumo
          </Typography>
          <TextField
            InputLabelProps={{ shrink: true }}
            variant="standard"
            label="Nombre del Insumo"
            fullWidth
            value={newInsumo.nombre}
            onChange={(e) => setNewInsumo({ ...newInsumo, nombre: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0 } }}
            variant="standard"
            label="Cantidad"
            type="number"
            fullWidth
            value={newInsumo.cantidad}
            onChange={(e) => setNewInsumo({ ...newInsumo, cantidad: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddInsumo}
              disabled={!newInsumo.nombre.trim() || newInsumo.cantidad <= 0}
            >
              Aceptar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Habitacion;
