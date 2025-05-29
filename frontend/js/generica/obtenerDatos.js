import { paginateData } from "./paginateData.js";

/**
 * Función genérica para obtener datos de cualquier API y paginarlos.
 * @param {Object} config - Configuración de la función.
 * @param {string} config.url - URL del endpoint de la API.
 * @param {string} config.containerId - ID del contenedor donde se renderizan los datos.
 * @param {string} config.paginationId - ID del contenedor donde se muestra la paginación.
 * @param {Function} config.renderItemFn - Función que recibe un ítem y retorna un nodo HTML.
 * @param {number} [config.itemsPerPage=3] - Cantidad de ítems por página.
 */
export async function fetchWithPagination({ url, containerId, paginationId, renderItemFn, itemsPerPage = 3 }) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        paginateData({
            data,
            containerId,
            paginationId,
            renderItemFn,
            itemsPerPage
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}

/**
 * Función genérica para obtener datos sin renderizar ni paginar.
 * @param {string} url - URL del endpoint de la API.
 * @returns {Promise<any>} - Los datos obtenidos o [] en caso de error.
 */
export async function fetchDataSimple(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return [];
    }
}
