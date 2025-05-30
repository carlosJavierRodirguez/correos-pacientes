import { deleteResource } from "../generica/eliminarDato.js";
import { fetchWithPagination } from "../generica/obtenerDatos.js";
import { urlApi } from "../urlApis.js";
import { renderMedicineForm } from "./medicineForm.js";

export const reloadPatient = () => {
    const container = document.getElementById("container-medicine");
    container.innerHTML = ""; // Limpia el contenedor
    fetchWithPagination({
        url: urlApi.urlMedicines,
        containerId: "container-medicine",
        paginationId: "pagination-medicine",
        renderItemFn: renderMedicineCard,
        itemsPerPage: 8
    });
};

export function renderMedicineCard(medicine) {
    const card = document.createElement("div");
    card.classList.add("col-md-3");

    card.innerHTML = `
    <div class="mb-3">
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="fas fa-capsules me-2"></i>${medicine.name}
                </h5>
                <p class="card-text">
                    <strong>Expira:</strong> ${medicine.expiration}
                </p>
                <p class="card-text">
                    <strong>Farmacéutica:</strong> ${medicine.pharmaceuticals}
                </p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-primary btn-sm btn-edit-med" data-id="${medicine.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-delete-med" data-id="${medicine.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Botón: Editar medicamento
    card.querySelector(".btn-edit-med").addEventListener("click", () => {
        renderMedicineForm(medicine); // Debes tener esta función para cargar el form de edición
    });

    // Botón: Eliminar medicamento
    card.querySelector(".btn-delete-med").addEventListener("click", () => {
        deleteResource(medicine.id, urlApi.urlMedicines, "Medicamento", reloadPatient);
    });

    return card;
}


document.addEventListener("DOMContentLoaded", () => {

    fetchWithPagination({
        url: urlApi.urlMedicines,
        containerId: "container-medicine",
        paginationId: "pagination-medicine",
        renderItemFn: renderMedicineCard,
        itemsPerPage: 8
    });
});
