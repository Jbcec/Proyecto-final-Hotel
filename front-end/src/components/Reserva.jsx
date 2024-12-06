import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReservaById } from "../services/api"
import TransferList from "./TransferList";
import "../styles/Habitacion.css";
import {
  Box,
  Container,
  Grid2,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function createData(rsv_ID, rsv_clt_ID, rsv_hbt_habitacion_ID, rsv_monto, rsv_check_in, rsv_check_out, rsv_estado) {
  return { rsv_ID, rsv_clt_ID, rsv_hbt_habitacion_ID, rsv_monto, rsv_check_in, rsv_check_out, rsv_estado };
}

const rsvTest = createData(101, "Juan", [101, 102, 103], "$1500", "01/01/22", "03/01/22", "Falta Pagar");

const Reserva = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rsv, setRsv] = useState({});
  const [editing, setEditing] = useState({ checkIn: "", checkOut: "", habitaciones: [] });

  const allRooms = [101, 102, 103, 104, 105];
  const [reservedRooms, setReservedRooms] = useState([101, 102]);// Habitaciones disponibles (puedes reemplazar con datos dinámicos)
  const [availableRooms, setAvaibleRooms] = useState(allRooms.filter((room) => !reservedRooms.includes(room)));

  const handleTransfer = (newSelectedRooms) => {
    setEditing((prev) => ({
      ...prev,
      habitaciones: newSelectedRooms,
    }));
  };

  const handleStateChange = async (newState) => {
    alert("Estado de la reserva actualizado");
    navigate("/"); // Redirige a Home tras actualizar
  };

  const handleEditReservation = () => {
    // Aquí puedes agregar la lógica para enviar los cambios al backend
    console.log("Nuevos datos de la reserva:", editing);
    setEditing({ checkIn: "", checkOut: "", habitaciones: [] });
  };

  const handleCancelReservation = () => {
    // Lógica para cancelar la reserva
    alert("Reserva cancelada.");
    navigate("/");
  };

  const handleCheckIn = () => {
    alert("Check-in confirmado.");
  };

  const handleCheckOut = () => {
    alert("Check-out confirmado.");
  };

  useEffect(() => {
    console.log(id);
    getReservaById(id).then((res) => setRsv(res));
    console.log(rsv)
  }, [])

  return (
    <Container sx={{ paddingTop: "1em" }}>
      <Grid2 container spacing={3} sx={{ width: "100%" }}>
        {/* Card de Información de la Reserva */}
        <Grid2 size={6} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                Reserva N°{rsv.rsv_ID}
              </Typography>
              <Typography variant="body1">
                Cliente: <strong>{rsv.rsv_clt_ID}</strong>
              </Typography>
              <Typography variant="body1">
                Habitación: <strong>{rsv.rsv_hbt_habitacion_ID ? rsv.rsv_hbt_habitacion_ID.join(", ") : "-"}</strong>
              </Typography>
              <Typography variant="body1">
                Monto: <strong>{rsv.rsv_monto}</strong>
              </Typography>
              <Typography variant="body1">
                Estado: <strong>{rsv.rsv_estado}</strong>
              </Typography>
              <Typography variant="body1">
                Check In: <strong>{rsv.rsv_check_in}</strong>
              </Typography>
              <Typography variant="body1">
                Check Out: <strong>{rsv.rsv_check_out}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={6} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                Confirmación
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: "2em" }}>
                <Button variant="contained" color="success" onClick={handleCheckIn}>
                  Confirmar Check In
                </Button>
                <Button variant="contained" color="warning" onClick={handleCheckOut}>
                  Confirmar Check Out
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Card de Modificar Reserva */}
        <Grid2 size={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Modificar Reserva
              </Typography>
              <TextField
                label="Nuevo Check In"
                variant="standard"
                type="date"
                fullWidth
                value={editing.checkIn}
                onChange={(e) => setEditing({ ...editing, checkIn: e.target.value })}
                sx={{ marginBottom: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Nuevo Check Out"
                variant="standard"
                type="date"
                fullWidth
                value={editing.checkOut}
                onChange={(e) => setEditing({ ...editing, checkOut: e.target.value })}
                sx={{ marginBottom: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ display: "flex", gap: 2, marginTop: 2, justifyContent: "center" }}>
                <TransferList
                  left={availableRooms}
                  right={reservedRooms}
                  setLeft={setAvaibleRooms}
                  setRight={setReservedRooms}
                />
                <Box sx={{ display: "flex", gap: 2, marginTop: 2, justifyContent: "center", alignItems: 'center', flexDirection: "column", pl: "4em" }}>
                  <Button variant="contained" disabled={reservedRooms.length < 1 ? true : false} color="primary" onClick={handleEditReservation} sx={{ width: "200px", height: "50px" }}>
                    Guardar Cambios
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleCancelReservation} sx={{ width: "200px", height: "50px" }}>
                    Cancelar Reserva
                  </Button></Box>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Reserva;
