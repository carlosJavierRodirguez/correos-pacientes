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
    itemsPerPage: 6
  });
};

export function renderReminderCard(reminder) {
  const card = document.createElement("div");
  card.classList.add("col-md-4");

  card.innerHTML = `
  <div class="mb-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title mb-3">
          <i class="fas fa-notes-medical me-2"></i> Recordatorio para ${reminder.patient.name}
        </h5>
        <div class="row">
          <div class="col-md-12">
            <p class="card-text"><strong>Medicamento:</strong> ${reminder.medicine.name}</p>
          </div>
          <div class="col-md-6">
            <p class="card-text"><strong>Fecha:</strong> ${reminder.date}</p>
          </div>
          <div class="col-md-6">
            <p class="card-text"><strong>Hora:</strong> ${reminder.time}</p>
          </div>
          <div class="col-md-4 d-flex align-items-center mt-3">

            <div class="form-check form-switch">
              <input class="form-check-input toggle-switch" type="checkbox" id="toggleReminder-${reminder.id}" 
              ${!reminder.suspended ? "checked" : ""}>
              <label class="form-check-label ms-2" for="toggleReminder-${reminder.id}">
                ${!reminder.suspended ? "Activado" : "Desactivado"}
              </label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button class="btn btn-outline-primary btn-sm btn-edit" data-id="${reminder.id}">
            <i class="fas fa-edit me-1"></i> Editar
          </button>
          <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${reminder.id}">
            <i class="fas fa-trash me-1"></i> Eliminar
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
    itemsPerPage: 6
  });
});
