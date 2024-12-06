import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ errorCode = "404", errorMessage = "Página no encontrada" }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Cambia la ruta si tu página principal es diferente
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          {errorCode}
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          {errorMessage}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 4 }}>
          Lo sentimos, pero la página que estás buscando no existe, o ha ocurrido un error inesperado.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoHome}
        >
          Ir al inicio
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
