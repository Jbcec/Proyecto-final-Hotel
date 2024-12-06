import React, { useState, useEffect } from "react";
import { getReservas } from "../services/api";
import "../styles/Reservas.css";
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReservas, setFilteredReservas] = useState([]);

  let navigate = useNavigate()

  const handleClick = (rsv_ID) => {
    navigate(`/reservas/${rsv_ID}`)
  }

  useEffect(() => {
    getReservas().then((res) => setReservas(res));
  }, []);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = reservas.filter(
      (reserva) =>
        reserva.numero_reserva.toString().includes(query) ||
        reserva.clt_ID.dni.includes(query)
    );
    setFilteredReservas(filtered);
  };

  const handleCheckIn = async (idReserva) => {
    alert("Check-in realizado con éxito");
  };

  const handleCheckOut = async (idReserva) => {
    alert("Check-out realizado con éxito");
  };

  return (
    <Container sx={{ paddingTop: "3em" }}>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="reservas table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f5f5f5",
              }}
            >
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Número de Reserva
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Cliente
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Habitaciones
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Monto
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Check In
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Check Out
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Estado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.map((row) => (
              <TableRow
                key={row.rsv_ID}
                hover
                onClick={() => handleClick(row.rsv_ID)}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "#f0f8ff",
                    cursor: "pointer",
                  },
                }}
              >
                <TableCell align="center">{row.rsv_ID}</TableCell>
                <TableCell align="center">{row.clt_ID}</TableCell>
                <TableCell align="center">{row.numero}</TableCell>
                <TableCell align="center">${row.rsv_monto}</TableCell>
                <TableCell align="center">
                  {row.rsv_check_in ? row.rsv_check_in : "-"}
                </TableCell>
                <TableCell align="center">
                  {row.rsv_check_out ? row.rsv_check_out : "-"}
                </TableCell>
                <TableCell align="center">{row.rsv_estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Reservas;
