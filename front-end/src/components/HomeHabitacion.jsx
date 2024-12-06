import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHabitaciones } from "../services/api";
import "../styles/HomeHabitacion.css";
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(numero, estado, rsv_hbt_reserva_ID, rsv_check_in, rsv_check_out, rsv_clt_ID) {
  return { numero, estado, rsv_hbt_reserva_ID, rsv_check_in, rsv_check_out, rsv_clt_ID };
}

const rows = [
  createData(101, "Lista", 123, "01/01/22", "03/01/22", "Juan"),
  createData(102, "Lista", 124, "01/01/22", "03/01/22", "Juan"),
  createData(103, "Falta insumos", 125, "01/01/22", "03/01/22", "Juan"),
  createData(104, "Clausurada", 126, "01/01/22", "03/01/22", "Juan"),
  createData(105, "Lista", 127, "01/01/22", "03/01/22", "Juan"),
  createData(201, "Lista", 128, "01/01/22", "03/01/22", "Juan"),
  createData(202, "Lista", 129, "01/01/22", "03/01/22", "Juan"),
  createData(203, "Falta insumos", 1234, "", "", ""),
  createData(204, "Clausurada", 12345, "", "", ""),
  createData(205, "Lista", 12432, "01/01/22", "03/01/22", "Juan"),
];


const Home = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  let navigate = useNavigate()

  const handleClick = (numero) => {
    navigate(`/habitaciones/${numero}`)
  }

  React.useEffect(() => {
    getHabitaciones().then((res) => setHabitaciones(res));
  }, [])

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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f5f5f5",
              }}
            >
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Número de Habitación
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Estado
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Check In
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Check Out
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Cliente
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {habitaciones.map((row) => (
              <TableRow
                key={row.name}
                hover
                onClick={() => handleClick(row.numero)}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "#f0f8ff",
                    cursor: "pointer",
                  },
                }}
              >
                <TableCell align="center">
                  {row.numero}
                </TableCell>
                <TableCell align="center">{row.estado}</TableCell>
                <TableCell align="center">
                  {row.reserva?.check_in ? row.reserva?.check_in : "-"}
                </TableCell>
                <TableCell align="center">
                  {row.reserva?.check_out ? row.reserva?.check_out : "-"}
                </TableCell>
                <TableCell align="center">
                  {row.reserva?.cliente ? row.reserva?.cliente.nombre + " "+ row.reserva?.cliente.apellido : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Home;
