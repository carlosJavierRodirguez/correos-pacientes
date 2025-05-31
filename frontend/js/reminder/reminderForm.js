import { insertarDatos } from "../generica/insertarDatos.js";
import { alertas } from "../alertas/alertas.js";
import { urlApi } from "../urlApis.js";
import { fetchWithPagination } from "../generica/obtenerDatos.js";
import { renderReminderCard } from "./getDataReminder.js";
import { fetchDataSimple } from "../generica/obtenerDatos.js";

// FUNCIÓN PARA RENDERIZAR EL FORMULARIO DE RECORDATORIO
export async function renderReminderForm(data = null) {
    const modalTitle = document.getElementById("exampleModalLabel");
    const modalForm = document.getElementById("modal-form");
    const modal = new bootstrap.Modal(document.getElementById("reminder-modal"));
    const btnGuardar = document.querySelector("#reminder-modal .btn-primary");

    // Cambiar título
    modalTitle.innerHTML = data
        ? 'Editar Recordatorio <i class="fas fa-bell me-2"></i>'
        : 'Agregar Recordatorio <i class="fas fa-bell me-2"></i>';

    // Llamar datos de pacientes y medicamentos
    const patients = await fetchDataSimple(urlApi.urlPatientes);
    const medicines = await fetchDataSimple(urlApi.urlMedicines);

    // Opciones para pacientes
    const patientOptions = `
    <option disabled ${!data ? "selected" : ""}>Selecciona un paciente</option>
    ${patients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(p =>
                `<option value="${p.id}" ${p.id === data?.patient_id ? "selected" : ""}>${p.name}</option>`
            ).join("")}
`;

    // Opciones para medicamentos
    const medicineOptions = `
    <option disabled ${!data ? "selected" : ""}>Selecciona un medicamento</option>
    ${medicines
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(m =>
                `<option value="${m.id}" ${m.id === data?.medicine_id ? "selected" : ""}>${m.name}</option>`
            ).join("")}
`;


    // Generar formulario
    modalForm.innerHTML = `
        <div class="mb-3">
            <label for="patientId" class="form-label">Paciente</label>
            <select class="form-select" id="select-patient">${patientOptions}</select>
        </div>
        <div class="mb-3">
            <label for="medicineId" class="form-label">Medicamento</label>
           <select class="form-select" id="select-medicine">${medicineOptions}</select>
        </div>
        <div class="mb-3">
            <label for="date" class="form-label">Fecha</label>
            <input type="date" class="form-control" id="date" value="${data?.date || ''}">
        </div>
        <div class="mb-3">
            <label for="time" class="form-label">Hora</label>
            <input type="time" class="form-control" id="time" value="${data?.time || ''}">
        </div>
    `;

    // Mostrar el modal
    modal.show();

    // Limpiar eventos previos
    const newBtn = btnGuardar.cloneNode(true);
    btnGuardar.parentNode.replaceChild(newBtn, btnGuardar);

    // Evento guardar
    newBtn.addEventListener("click", async () => {
        const reminder = {
            patient: document.getElementById("select-patient").value,
            medicine: document.getElementById("select-medicine").value,
            date: document.getElementById("date").value.trim(),
            time: document.getElementById("time").value.trim()
        };

        if (data?.id) reminder.id = data.id;
        if (!validarFormularioReminder(reminder)) return;

        console.log(reminder);
        
        await insertarDatos(
            urlApi.urlReminder,
            reminder,
            () => {
                alertas("success", data ? "Recordatorio actualizado" : "Recordatorio registrado", "Operación exitosa.");
                fetchWithPagination({
                    url: urlApi.urlReminder,
                    containerId: "container-reminder",
                    paginationId: "pagination-reminder",
                    renderItemFn: renderReminderCard,
                    itemsPerPage: 6
                });
                modal.hide();
            },
            (error) => {
                alertas("error", "Error", error.message);
            }
        );
    });
}

function validarFormularioReminder(reminder) {
    if (!reminder.patient_id || !reminder.medicine_id || !reminder.date || !reminder.time) {
        alertas("warning", "Campos requeridos", "Todos los campos son obligatorios.");
        return false;
    }
    return true;
}


document.getElementById("btn-add-reminder").addEventListener("click", () => {
    renderReminderForm(); // Modo registrar
});
