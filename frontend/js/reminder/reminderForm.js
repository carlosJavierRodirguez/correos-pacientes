import { insertarDatos } from "../generica/insertarDatos.js";
import { alertas } from "../alertas/alertas.js";
import { urlApi } from "../urlApis.js";
import { fetchWithPagination } from "../generica/obtenerDatos.js";
import { renderReminderCard } from "./getDataReminder.js";
import { fetchDataSimple } from "../generica/obtenerDatos.js";

// FUNCIÓN PARA RENDERIZAR EL FORMULARIO DE RECORDATORIO
export async function renderReminderForm(data = null) {
    const modalTitle = document.getElementById("exampleModalLabel");
    const selectPatient = document.getElementById("select-patient");
    const selectMedicine = document.getElementById("select-medicine");
    const inputDate = document.getElementById("date");
    const inputTime = document.getElementById("time");
    const botonGuardar = document.querySelector("#reminder-modal .btn-primary");

    // Cambiar título del modal
    modalTitle.innerHTML = data
        ? 'Editar Recordatorio <i class="fas fa-bell me-2"></i>'
        : 'Agregar Recordatorio <i class="fas fa-bell me-2"></i>';

    // Obtener pacientes y medicamentos
    const patients = await fetchDataSimple(urlApi.urlPatientes);
    const medicines = await fetchDataSimple(urlApi.urlMedicines);

    // Construir opciones de pacientes
    selectPatient.innerHTML = `
        <option disabled ${!data ? "selected" : ""}>Selecciona un paciente</option>
        ${patients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(p => `<option value="${p.id}" ${p.id === data?.patient?.id ? "selected" : ""}>${p.name}</option>`)
            .join("")}
    `;

    // Construir opciones de medicamentos
    selectMedicine.innerHTML = `
        <option disabled ${!data ? "selected" : ""}>Selecciona un medicamento</option>
        ${medicines
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(m => `<option value="${m.id}" ${m.id === data?.medicine?.id ? "selected" : ""}>${m.name}</option>`)
            .join("")}
    `;

    // Poner valores de fecha y hora
    inputDate.value = data?.date || "";
    inputTime.value = data?.time || "";

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById("reminder-modal"));
    modal.show();

    // Limpiar eventos previos
    const nuevoBoton = botonGuardar.cloneNode(true);
    botonGuardar.parentNode.replaceChild(nuevoBoton, botonGuardar);

    // Agregar evento de guardado
    nuevoBoton.addEventListener("click", async () => {
        // Validar
        if (!validarFormularioReminder()) return;

        const reminder = {
            patient: { id: parseInt(selectPatient.value) },
            medicine: { id: parseInt(selectMedicine.value) },
            date: inputDate.value.trim(),
            time: inputTime.value.trim()
        };

        if (data?.id) reminder.id = data.id;

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

function validarFormularioReminder() {
    const selectPatient = document.getElementById("select-patient");
    const selectMedicine = document.getElementById("select-medicine");
    const inputDate = document.getElementById("date").value.trim();
    const inputTime = document.getElementById("time").value.trim();

    if (!selectPatient.value || selectPatient.value === "" ||
        !selectMedicine.value || selectMedicine.value === "" ||
        !inputDate || !inputTime) {
        alertas("warning", "Campos requeridos", "Todos los campos son obligatorios.");
        return false;
    }

    // Validar fecha: que no sea pasada
    const today = new Date();
    const selectedDate = new Date(inputDate);

    // Quitar hora de today para comparar solo fechas
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alertas("warning", "Fecha inválida", "La fecha no puede ser anterior a hoy.");
        return false;
    }

    return true;
}

document.getElementById("btn-add-reminder").addEventListener("click", () => {
    renderReminderForm(); // Modo registrar
});