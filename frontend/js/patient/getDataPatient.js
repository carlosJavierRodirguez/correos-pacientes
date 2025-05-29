import { deleteResource } from "../generica/eliminarDato.js";
import { fetchWithPagination } from "../generica/obtenerDatos.js";
import { urlApi } from "../urlApis.js";
// import { renderGodForm } from "./godForm.js";


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
    card.classList.add("col-md-4");

    card.innerHTML = `
    <div class="mb-4"> <!-- Agrega espacio debajo de la tarjeta -->
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="fas fa-user me-2"></i>${patient.name}
                </h5>
                <p class="card-text">
                    <strong>Correo:</strong> ${patient.email}
                </p>
                <p class="card-text">
                    <strong>Tel:</strong> ${patient.telephone}
                </p>
                <div class="d-flex justify-content-between mt-3">
                    <button class="btn btn-primary btn-sm btn-view-meds" data-id="${patient.id}">
                        <i class="fas fa-eye me-1"></i> Ver Medicamentos
                    </button>
                    <button class="btn btn-outline-primary btn-sm btn-edit" data-id="${patient.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${patient.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
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
    // card.querySelector(".btn-edit").addEventListener("click", () => {
    //     renderPatientForm(patient); // Muestra el formulario con los datos del paciente
    // });

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
