import { deleteResource } from "../generica/eliminarDato.js";
import { fetchWithPagination } from "../generica/obtenerDatos.js";
import { urlApi } from "../urlApis.js";
import { renderPatientForm } from "./patientForm.js";


export const reloadPatient = () => {
  const container = document.getElementById("container-pacientes");
  container.innerHTML = ""; // Limpia el contenedor
  fetchWithPagination({
    url: urlApi.urlPatientes,
    containerId: "container-pacientes",
    paginationId: "paginationPatiend",
    renderItemFn: renderPatientCard,
    itemsPerPage: 3
  });
};

export function renderPatientCard(patient) {
  const card = document.createElement("div");
  card.classList.add("col-12", "col-sm-6", "col-md-4", "mb-4");

  card.innerHTML = `
<div class="card shadow h-100 border-0">
  <!-- Header de la tarjeta -->
  <div class="card-header bg-primary text-white border-0">
    <h6 class="card-title d-flex align-items-center mb-0">
      <span class="badge bg-light text-primary rounded-circle p-2 me-3">
       <i class="fa-regular fa-user"></i>
      </span>
      <div>
        <div class="fw-bold">${patient.name}</div>
      </div>
    </h6>
  </div>

  <!-- Cuerpo de la tarjeta -->
  <div class="card-body d-flex flex-column">
    <!-- Información del paciente -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3 p-2 bg-light rounded">
        <div class="text-primary me-3">
          <i class="fas fa-envelope fa-lg"></i>
        </div>
        <div class="flex-grow-1">
          <small class="text-muted d-block">Correo electrónico</small>
          <span class="fw-medium text-truncate d-block">${patient.email}</span>
        </div>
      </div>
      
      <div class="d-flex align-items-center p-2 bg-light rounded">
        <div class="text-success me-3">
          <i class="fas fa-phone fa-lg"></i>
        </div>
        <div class="flex-grow-1">
          <small class="text-muted d-block">Teléfono</small>
          <span class="fw-medium">${patient.telephone}</span>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="mt-auto">
      <!-- Botones secundarios -->
      <div class="btn-group w-100" role="group">
        <button class="btn btn-outline-primary btn-edit-patient" data-id="${patient.id}">
          <i class="fas fa-edit me-1"></i>
          <span class="d-none d-sm-inline">Editar</span>
        </button>
        <button class="btn btn-outline-danger btn-delete" data-id="${patient.id}">
          <i class="fas fa-trash-alt me-1"></i>
          <span class="d-none d-sm-inline">Eliminar</span>
        </button>
      </div>
    </div>
  </div>
</div>
`;

  card.querySelector(".btn-edit-patient").addEventListener("click", () => {
    renderPatientForm(patient);
  });

  card.querySelector(".btn-delete").addEventListener("click", () => {
    deleteResource(patient.id, urlApi.urlPatientes, "Paciente", reloadPatient);
  });

  return card;
}

document.addEventListener("DOMContentLoaded", () => {

  fetchWithPagination({
    url: urlApi.urlPatientes,
    containerId: "container-pacientes",
    paginationId: "paginationPatiend",
    renderItemFn: renderPatientCard,
    itemsPerPage: 3
  });
});
