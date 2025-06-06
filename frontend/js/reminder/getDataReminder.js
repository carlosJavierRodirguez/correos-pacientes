import { deleteResource } from "../generica/eliminarDato.js";
import { fetchWithPagination } from "../generica/obtenerDatos.js";
import { insertarDatos } from "../generica/insertarDatos.js";
import { urlApi } from "../urlApis.js";
import { renderReminderForm } from "./reminderForm.js";
import { alertas } from "../alertas/alertas.js";

export const reloadReminder = () => {
  const container = document.getElementById("container-reminder");
  container.innerHTML = ""; // Limpia el contenedor
  fetchWithPagination({
    url: urlApi.urlReminder,
    containerId: "container-reminder",
    paginationId: "pagination-reminder",
    renderItemFn: renderReminderCard,
    itemsPerPage: 3
  });
};

export function renderReminderCard(reminder) {
  const card = document.createElement("div");
  card.classList.add("col-12", "col-sm-6", "col-md-4", "mb-4");

  card.innerHTML = `
<div class="card shadow h-100 border-0">
  <!-- Header de la tarjeta -->
  <div class="card-header bg-primary text-white border-0">
    <h6 class="card-title d-flex align-items-center mb-0">
      <span class="badge bg-light text-primary rounded-circle p-2 me-3">
        <i class="fas fa-notes-medical"></i>
      </span>
      <div>
        <div class="fw-bold">Recordatorio para ${reminder.patient.name}</div>
      </div>
    </h6>
  </div>

  <!-- Cuerpo de la tarjeta -->
  <div class="card-body d-flex flex-column">
    <!-- Información del recordatorio -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3 p-2 bg-light rounded">
        <div class="text-info me-3">
          <i class="fas fa-pills fa-lg"></i>
        </div>
        <div class="flex-grow-1">
          <small class="text-muted d-block">Medicamento</small>
          <span class="fw-medium">${reminder.medicine.name}</span>
        </div>
      </div>

      <div class="d-flex align-items-center mb-3 p-2 bg-light rounded">
        <div class="text-warning me-3">
          <i class="fas fa-calendar-day fa-lg"></i>
        </div>
        <div class="flex-grow-1">
          <small class="text-muted d-block">Fecha</small>
          <span class="fw-medium">${reminder.date}</span>
        </div>
      </div>

      <div class="d-flex align-items-center p-2 bg-light rounded">
        <div class="text-success me-3">
          <i class="fas fa-clock fa-lg"></i>
        </div>
        <div class="flex-grow-1">
          <small class="text-muted d-block">Hora</small>
          <span class="fw-medium">${reminder.time}</span>
        </div>
      </div>

      <!-- Interruptor de activación -->
      <div class="d-flex align-items-center p-2 mt-3 bg-light rounded">
        <div class="flex-grow-1 d-flex align-items-center">
          <div class="form-check form-switch m-0">
            <input class="form-check-input toggle-switch" type="checkbox" id="toggleReminder-${reminder.id}" 
              ${!reminder.suspended ? "checked" : ""}>
            <label class="form-check-label ms-2" for="toggleReminder-${reminder.id}">
              ${!reminder.suspended ? "Activado" : "Desactivado"}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="mt-auto">
      <div class="btn-group w-100" role="group">
        <button class="btn btn-outline-primary btn-edit" data-id="${reminder.id}">
          <i class="fas fa-edit me-1"></i>
          <span class="d-none d-sm-inline">Editar</span>
        </button>
        <button class="btn btn-outline-danger btn-delete" data-id="${reminder.id}">
          <i class="fas fa-trash me-1"></i>
          <span class="d-none d-sm-inline">Eliminar</span>
        </button>
      </div>
    </div>
  </div>
</div>
`;



  // Botón: Editar
  card.querySelector(".btn-edit").addEventListener("click", () => {
    renderReminderForm(reminder);
  });

  card.querySelector(`#toggleReminder-${reminder.id}`).addEventListener("change", () => {
    toggleReminderSuspension(reminder.id, reminder);
  });


  // Botón: Eliminar
  card.querySelector(".btn-delete").addEventListener("click", () => {
    deleteResource(reminder.id, urlApi.urlReminder, "Recordatorio", reloadReminder);
  });

  return card;
}

export async function toggleReminderSuspension(id, reminder) {
  const nuevoEstado = !reminder.suspended; // Cambia true ⇄ false

  const updatedReminder = {
    id: id,
    patient: { id: reminder.patient.id },
    medicine: { id: reminder.medicine.id },
    date: reminder.date,
    time: reminder.time,
    suspended: nuevoEstado.toString() // "true" o "false" como string
  };

  try {
    await insertarDatos(
      urlApi.urlReminder,
      updatedReminder,
      () => {
        const estadoTexto = nuevoEstado ? "desactivado" : "activado";
        alertas("success", "Estado actualizado", `Recordatorio ${estadoTexto} correctamente`);
        reloadReminder(); // Asegúrate de tener esta función o reemplaza por fetchReminderCards
      },
      (error) => {
        alertas("error", "Error", error.message);
      }
    );
  } catch (error) {
    alertas("error", "Error", "No se pudo actualizar el recordatorio.");
  }
}

document.addEventListener("DOMContentLoaded", () => {

  fetchWithPagination({
    url: urlApi.urlReminder,
    containerId: "container-reminder",
    paginationId: "pagination-reminder",
    renderItemFn: renderReminderCard,
    itemsPerPage: 3
  });
});
