import { alertas } from "../alertas/alertas.js";

export async function insertarDatos(url, data, onSuccess = null, onError = null) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "User-Agent": "web",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en la solicitud POST.");
        }

        const responseData = await response.json();

        // Si no se define un onSuccess, mostrar alerta por defecto
        if (onSuccess) {
            onSuccess(responseData);
        } else {
            alertas("success", "Datos insertados", "Los datos fueron insertados correctamente.");
        }

        return responseData;

    } catch (error) {
        console.error("Error en sendPostRequest:", error);
        if (onError) {
            onError(error);
        } else {
            alertas("error", "Error de conexión", error.message);
        }
    }
}
