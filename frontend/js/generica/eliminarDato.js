// archivo: deleteResource.js
import { alertas } from "../alertas/alertas.js";

// Genérica para eliminar recursos
async function serverDeleteResource(id, urlBase, resourceName, reloadCallback) {
    try {
        const response = await fetch(urlBase + id, {
            method: "DELETE",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        alertas("success", `${capitalize(resourceName)} eliminada`, `La ${resourceName} ha sido eliminada correctamente.`);
        if (typeof reloadCallback === "function") reloadCallback();

    } catch (error) {
        console.error(`Error al eliminar la ${resourceName}:`, error);
        alertas("error", `Error al eliminar`, `No se pudo eliminar la ${resourceName}.`);
    }
}

export function deleteResource(id, urlBase, resourceName, reloadCallback) {
    alertas(
        "warning",
        `¿Eliminar ${resourceName}?`,
        `¿Estás seguro de que deseas eliminar esta ${resourceName}?`,
        {
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
        }
    ).then((result) => {
        if (result.isConfirmed) {
            serverDeleteResource(id, urlBase, resourceName, reloadCallback);
        } else {
            alertas("info", "Cancelado", `La eliminación fue cancelada.`);
        }
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}