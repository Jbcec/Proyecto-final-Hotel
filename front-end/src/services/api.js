const API_BASE_URL = "http://localhost:8080/";

const headers = {
    "Content-Type": "application/json",
};

export const createReserva = async (id, reservaData) => {
    try {
        const response = await fetch(`${API_BASE_URL}api/reservas/${id}`, {
            method: "POST",
            headers,
            body: JSON.stringify(reservaData),
        });
        if (!response.ok) throw new Error("Error creando la reserva");
        return await response.json();
    } catch (error) {
        console.error("Error en createReserva:", error);
        throw error;
    }
};

export const createCliente = async (clienteData) => {
    try {
        const response = await fetch(`${API_BASE_URL}api/clientes`, {
            method: "POST",
            headers,
            body: JSON.stringify(clienteData),
        });
        if (!response.ok) throw new Error("Error creando el cliente");
        return await response.json();
    } catch (error) {
        console.error("Error en createCliente:", error);
        throw error;
    }
};

export const getReservas = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}api/reservas`);
        if (!response.ok) throw new Error("Error obteniendo reservas");
        return await response.json();
    } catch (error) {
        console.error("Error en getReservas:", error);
        throw error;
    }
};

export const getReservaById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}api/reservas/${id}`);
        if (!response.ok) throw new Error("Error obteniendo la reserva");
        return await response.json();
    } catch (error) {
        console.error("Error en getReservaById:", error);
        throw error;
    }
};

export const getHabitaciones = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}api/habitaciones`);
        if (!response.ok) throw new Error("Error obteniendo habitaciones");
        return await response.json();
    } catch (error) {
        console.error("Error en getHabitaciones:", error);
        throw error;
    }
};

export const getHabitacionByNumero = async (numero) => {
    try {
        const response = await fetch(`${API_BASE_URL}api/habitaciones/byNumber/${numero}`);
        if (!response.ok) throw new Error("Error obteniendo la habitación");
        return await response.json();
    } catch (error) {
        console.error("Error en getHabitacionByNumero:", error);
        throw error;
    }
};

export const getAvailableRooms = async (check_in, check_out) => {
    const url = `${API_BASE_URL}api/habitaciones/disponibilidad?check_in=${encodeURIComponent(
        check_in
    )}&check_out=${encodeURIComponent(check_out)}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener habitaciones disponibles: ${response.status}`);
        }

        const data = await response.json();
        console.log("Habitaciones disponibles:", data);
        return data;
    } catch (error) {
        console.error("Error en el llamado GET:", error.message);
        throw error;
    }
}

export const patchHabitacion = async (id, estado) => {
    const url = `${API_BASE_URL}api/habitaciones/${id}`;

    const body = { estado };

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la habitación: ${response.status}`);
        }

        const data = await response.json();
        console.log("Actualización exitosa:", data);
        return data; // Retornamos la respuesta del servidor si es necesario
    } catch (error) {
        console.error("Error en la actualización:", error.message);
        throw error;
    }
}

export const getClientes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}api/clientes`);
        if (!response.ok) throw new Error("Error obteniendo clientes");
        return await response.json();
    } catch (error) {
        console.error("Error en getClientes:", error);
        throw error;
    }
};

export const getClienteById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}api/clientes/${id}`);
        if (!response.ok) throw new Error("Error obteniendo el cliente");
        return await response.json();
    } catch (error) {
        console.error("Error en getClienteById:", error);
        throw error;
    }
};

export const searchClientes = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}api/clientes/search?term=${query}`);
        if (!response.ok) throw new Error("Error buscando clientes");
        return await response.json();
    } catch (error) {
        console.error("Error en searchClientes:", error);
        throw error;
    }
};
