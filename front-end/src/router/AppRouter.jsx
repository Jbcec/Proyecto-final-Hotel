import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeHabitacion from "../components/HomeHabitacion";
import Habitacion from "../components/Habitacion";
import NuevaReserva from "../components/NuevaReserva";
import Reservas from "../components/Reservas";
import Reserva from "../components/Reserva";
import ErrorPage from "../pages/ErrorPage";
import Navbar from "../components/Navbar";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeHabitacion />} />
        <Route path="/habitaciones/:id" element={<Habitacion />} />
        <Route path="/reservas/nueva" element={<NuevaReserva />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/reservas/:id" element={<Reserva />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
