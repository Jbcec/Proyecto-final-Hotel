import React, { useState } from "react";
import { getClientes, searchClientes, getAvailableRooms } from "../services/api"
import AgregarClienteModal from "./AgregarClienteModal";
import "../styles/NuevaReserva.css";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  Radio,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const NuevaReserva = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    habitaciones: [],
    cliente: null,
    pago: { metodo_pago: "", monto: "", fecha: "" },
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [value, setValue] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => { console.log(openModal); setOpenModal(true); }
  const handleClose = () => setOpenModal(false);

  const handleNextStep = () => {
    setTimeout(() => {
      if (availableRooms.length > 0) {
        setStep(step + 1);
      } else {
        alert("No hay habitaciones disponibles en ese periodo");
      }
    }, 1000);
  };

  const handleFormerStep = () => {
    setStep(step - 1);
  };

  const handleClienteSearch = async (value) => {
    searchClientes(value).then((res) => setClientes(res));
  };

  const handleCreateReserva = async () => {
    alert("Reserva creada exitosamente");
    // Redirigir o limpiar
  };

  const handleFilterByDate = async (check_in, check_out) => {
    getAvailableRooms(check_in, check_out).then((res) => setAvailableRooms(res));
    handleNextStep();
  }

  React.useEffect(() => {
    getClientes().then((res) => setClientes(res));
  }, [])

  return (
    <Container sx={{ marginTop: "2em" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Crear Nueva Reserva
      </Typography>
      {step === 1 && (
        <Box sx={{ marginTop: "1.5em" }}>
          <Typography variant="h5" gutterBottom>
            1. Seleccionar Fechas
          </Typography>
          <TextField
            variant="standard"
            fullWidth
            type="date"
            label="Check-in"
            InputLabelProps={{ shrink: true }}
            value={formData.check_in}
            onChange={(e) =>
              setFormData({ ...formData, check_in: e.target.value })
            }
            sx={{ marginBottom: "1em" }}
          />
          <TextField
            fullWidth
            variant="standard"
            type="date"
            label="Check-out"
            InputLabelProps={{ shrink: true }}
            value={formData.check_out}
            onChange={(e) =>
              setFormData({ ...formData, check_out: e.target.value })
            }
          />
          <Box sx={{ marginTop: "1em", textAlign: "right" }}>
            <Button disabled={formData.check_in.length > 0 && formData.check_out.length > 0 ? false : true} variant="contained" onClick={() => handleFilterByDate(formData.check_in, formData.check_out)}>
              Siguiente
            </Button>
          </Box>
        </Box>
      )}
      {step === 2 && (
        <Box sx={{ marginTop: "1.5em" }}>
          <Typography variant="h5" gutterBottom>
            2. Seleccionar Habitaciones
          </Typography>
          <List>
            {availableRooms.map((room) => (
              <ListItem
                key={room.id_habitacion}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText
                  primary={`Habitación ${room.numero_habitacion}`}
                  secondary={`Capacidad: ${room.capacidad} - Precio: $${room.precio}`}
                />
                <Checkbox
                  onChange={() =>
                    setFormData({
                      ...formData,
                      habitaciones: [...formData.habitaciones, room.id_habitacion],
                    })
                  }
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ marginY: "1em" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={handleFormerStep}>
              Anterior
            </Button>
            <Button variant="contained" onClick={handleNextStep}>
              Siguiente
            </Button>
          </Box>
        </Box>
      )}
      {step === 3 && (
        <Box sx={{ marginTop: "1.5em" }}>
          <Typography variant="h5" gutterBottom>
            3. Datos del Cliente
          </Typography>
          <TextField
            InputLabelProps={{ shrink: true }}
            variant="standard"
            fullWidth
            label="Buscar por DNI, Nombre o Apellido"
            onChange={(e) => setValue(e.target.value)}
            sx={{ marginBottom: "1em" }}
          />
          <Button variant="contained" onClick={() => handleClienteSearch(value)}>
            Buscar
          </Button>
          <List sx={{ marginTop: "1em" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Nombre
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Documento
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Contacto
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((row) => (
                  <TableRow
                    key={row.clt_ID}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "#f0f8ff",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TableCell align="center">
                      {`${row.clt_nombre} ${row.clt_apellido}`}
                    </TableCell>
                    <TableCell align="center">{row.clt_dni}</TableCell>
                    <TableCell align="center">{row.clt_telefono}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </List>
          <Button variant="outlined" onClick={handleOpen} sx={{ marginTop: "1em" }}>
            Agregar Cliente
          </Button>
          <Divider sx={{ marginY: "1em" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={handleFormerStep}>
              Anterior
            </Button>
            <Button variant="contained" onClick={handleNextStep}>
              Siguiente
            </Button>
          </Box>
          <AgregarClienteModal
            open={openModal}
            onClose={handleClose}
            handleAddCliente={console.log("a")}
          />
        </Box>
      )}
      {step === 4 && (
        <Box sx={{ marginTop: "1.5em" }}>
          <Typography variant="h5" gutterBottom>
            4. Información de Pago
          </Typography>
          <TextField
            InputLabelProps={{ shrink: true }}
            variant="standard"
            fullWidth
            label="Método de pago"
            value={formData.pago.metodo_pago}
            onChange={(e) =>
              setFormData({
                ...formData,
                pago: { ...formData.pago, metodo_pago: e.target.value },
              })
            }
            sx={{ marginBottom: "1em" }}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: 0 } }}
            variant="standard"
            fullWidth
            type="number"
            label="Monto"
            value={formData.pago.monto}
            onChange={(e) =>
              setFormData({
                ...formData,
                pago: { ...formData.pago, monto: e.target.value },
              })
            }
            sx={{ marginBottom: "1em" }}
          />
          <TextField
            variant="standard"
            fullWidth
            type="date"
            label="Fecha"
            InputLabelProps={{ shrink: true }}
            value={formData.pago.fecha}
            onChange={(e) =>
              setFormData({
                ...formData,
                pago: { ...formData.pago, fecha: e.target.value },
              })
            }
          />
          <Divider sx={{ marginY: "1em" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={handleFormerStep}>
              Anterior
            </Button>
            <Button variant="contained" onClick={handleNextStep}>
              Siguiente
            </Button>
          </Box>
        </Box>
      )}
      {step === 5 && (
        <Box sx={{ marginTop: "1.5em" }}>
          <Typography variant="h5" gutterBottom>
            5. Confirmación
          </Typography>
          <Typography>
            <strong>Check-in:</strong> {formData.check_in}
          </Typography>
          <Typography>
            <strong>Check-out:</strong> {formData.check_out}
          </Typography>
          <Typography>
            <strong>Habitaciones:</strong> {formData.habitaciones.join(", ")}
          </Typography>
          <Typography>
            <strong>Cliente:</strong> {formData.cliente}
          </Typography>
          <Typography>
            <strong>Pago:</strong> {formData.pago.metodo_pago} - $
            {formData.pago.monto}
          </Typography>
          <Divider sx={{ marginY: "1em" }} />
          <Box sx={{ textAlign: "right" }}>
            <Button variant="outlined" onClick={handleFormerStep} sx={{ marginRight: "1em" }}>
              Anterior
            </Button>
            <Button variant="contained" onClick={handleCreateReserva}>
              Confirmar Reserva
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default NuevaReserva;
