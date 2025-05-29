// genericFilter.js
import { alertas } from "../alertas/alertas.js";
import { clearInput } from "../input.js";
import { paginateData } from "./paginateData.js";

export function setupGenericFilter({
    inputId,
    btnSearchId,
    btnClearId,
    containerId,
    paginationId,
    baseUrl,
    renderItemFn,
    itemsPerPage = 6,
    validationRegex = /^[a-zA-Z\s]+$/,
    validationMessage = "El nombre solo puede contener letras y espacios.",
    emptyMessage = "Por favor, ingresa un nombre para filtrar.",
    noResultsMessage = "No se encontraron resultados con el nombre ingresado.",
    fetchAllFn = null
}) {
    const validateFilter = () => {
        const value = document.getElementById(inputId)?.value.trim();

        if (!value) {
            alertas("info", "Campo vacío", emptyMessage);
            return false;
        }

        if (!validationRegex.test(value)) {
            alertas("error", "Error en el filtro", validationMessage);
            return false;
        }

        return true;
    };

    const getFilterUrl = () => {
        const value = document.getElementById(inputId)?.value.trim();
        if (value) return `${baseUrl}${encodeURIComponent(value)}`;
        return null;
    };

    const fetchData = async () => {
        try {
            if (!validateFilter()) return;

            const url = getFilterUrl();
            if (!url) {
                alertas("info", "Sin datos", emptyMessage);
                return;
            }

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
            const container = document.getElementById(containerId);

            if (!container) {
                console.warn(`No se encontró el contenedor '${containerId}' en el DOM.`);
                return;
            }

            if (data.length === 0) {
                container.innerHTML = `<p>${noResultsMessage}</p>`;
                return;
            }

            container.innerHTML = "";
            paginateData({ data, containerId, paginationId, renderItemFn, itemsPerPage });

        } catch (error) {
            console.error("Error al filtrar datos:", error);
            alertas("error", "Error al filtrar", "Ocurrió un error. Inténtalo de nuevo más tarde.");
        }
    };

    const deleteFilters = () => {
        const input = document.getElementById(inputId);
        clearInput(input);
        if (fetchAllFn) fetchAllFn();
    };


    const filterButton = document.getElementById(btnSearchId);
    if (filterButton) filterButton.addEventListener("click", fetchData);

    const clearButton = document.getElementById(btnClearId);
    if (clearButton) clearButton.addEventListener("click", deleteFilters);

}
