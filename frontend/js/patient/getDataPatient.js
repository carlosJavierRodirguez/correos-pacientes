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
    itemsPerPage: 6
  });
};

export function renderPatientCard(patient) {
  const card = document.createElement("div");
  card.classList.add("col-12", "col-sm-6", "col-md-4", "mb-4");

  card.innerHTML = `
  <div class="card shadow-sm h-100">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title d-flex align-items-center mb-3">
        <i class="fas fa-user me-2 text-primary"></i> ${patient.name}
      </h5>
      <p class="card-text mb-1">
        <strong>Correo:</strong> ${patient.email}
      </p>
      <p class="card-text mb-3">
        <strong>Tel:</strong> ${patient.telephone}
      </p>
      <div class="mt-auto d-flex flex-wrap gap-2 justify-content-between">
        <button class="btn btn-primary btn-sm flex-grow-1" data-id="${patient.id}">
          <i class="fas fa-eye me-1"></i> Ver Medicamentos
        </button>
        <button class="btn btn-outline-primary btn-sm flex-grow-1 btn-edit-patient" data-id="${patient.id}">
          <i class="fas fa-edit me-1"></i> Editar
        </button>
        <button class="btn btn-outline-danger btn-sm flex-grow-1 btn-delete" data-id="${patient.id}">
          <i class="fas fa-trash me-1"></i> Eliminar
        </button>
      </div>
    </div>
  </div>
`;

  // Botón: Ver Medicamentos
  // card.querySelector(".btn-view-meds").addEventListener("click", (e) => {
  //     const id = e.currentTarget.getAttribute("data-id");
  //     // Lógica para ver medicamentos asociados
  //     verMedicamentosPaciente(id);
  // });

  // Botón: Editar
  card.querySelector(".btn-edit-patient").addEventListener("click", () => {
    renderPatientForm(patient); // Muestra el formulario con los datos del paciente
  });

  // Botón: Eliminar
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
    itemsPerPage: 6
  });
});
