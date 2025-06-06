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
        itemsPerPage: 3
    });
};

export function renderMedicineCard(medicine) {
    const card = document.createElement("div");
    card.classList.add("col-12", "col-sm-6", "col-md-4", "mb-4");

    card.innerHTML = `
<div class="card shadow h-100 border-0">
  <!-- Header de la tarjeta -->
  <div class="card-header bg-primary text-white border-0">
    <h6 class="card-title d-flex align-items-center mb-0">
      <span class="badge bg-light text-primary rounded-circle p-2 me-3">
        <i class="fas fa-capsules"></i>
      </span>
      <div>
        <div class="fw-bold">${medicine.name}</div>
      </div>
    </h6>
  </div>

  <!-- Cuerpo de la tarjeta -->
  <div class="card-body d-flex flex-column">
    <!-- Información del medicamento -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3 p-2 bg-light rounded">
        <div class="text-danger me-3">
          <i class="fas fa-calendar-times fa-lg"></i>
        </div>
        <div class="flex-grow-1">
          <small class="text-muted d-block">Fecha de expiración</small>
          <span class="fw-medium">${medicine.expiration}</span>
        </div>
      </div>

      <div class="d-flex align-items-center p-2 bg-light rounded">
        <div class="text-info me-3">
          <i class="fas fa-industry fa-lg"></i>
        </div>
        <div class="flex-grow-1">
          <small class="text-muted d-block">Farmacéutica</small>
          <span class="fw-medium">${medicine.pharmaceuticals}</span>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="mt-auto">
      <div class="btn-group w-100" role="group">
        <button class="btn btn-outline-primary btn-edit-med" data-id="${medicine.id}">
          <i class="fas fa-edit me-1"></i>
          <span class="d-none d-sm-inline">Editar</span>
        </button>
        <button class="btn btn-outline-danger btn-delete-med" data-id="${medicine.id}">
          <i class="fas fa-trash me-1"></i>
          <span class="d-none d-sm-inline">Eliminar</span>
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
        itemsPerPage: 3
    });
});
