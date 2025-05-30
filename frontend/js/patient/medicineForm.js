import { insertarDatos } from "../generica/insertarDatos.js";
import { alertas } from "../alertas/alertas.js";
import { urlApi } from "../urlApis.js";
import { fetchWithPagination } from "../generica/obtenerDatos.js";
import { renderPatientCard } from "./getDataPatient.js"; // Asegúrate de tener esta función

// MOSTRAR MODAL PARA REGISTRAR / EDITAR PACIENTE
export function renderPatientForm(data = null) {
    const tituloModal = document.getElementById("tituloModal");
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const telefonoInput = document.getElementById("telefono");
    const botonGuardar = document.querySelector("#exampleModal .btn-primary");

    // Cambiar título y valores
    tituloModal.innerHTML = data
        ? 'Editar Paciente <i class="fas fa-user me-2"></i>'
        : 'Agregar Paciente <i class="fas fa-user me-2"></i>';

    nombreInput.value = data?.name || "";
    correoInput.value = data?.email || "";
    telefonoInput.value = data?.telephone || "";

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show();

    // Limpiar eventos previos
    const nuevoBoton = botonGuardar.cloneNode(true);
    botonGuardar.parentNode.replaceChild(nuevoBoton, botonGuardar);

    // Agregar evento de guardado
    nuevoBoton.addEventListener("click", async () => {
        // Validar
        if (!validarFormularioPaciente()) return;

        const patientData = {
            name: nombreInput.value.trim(),
            email: correoInput.value.trim(),
            telephone: telefonoInput.value.trim()
        };

        if (data?.id) patientData.id = data.id;

        await insertarDatos(
            urlApi.urlPatientes,
            patientData,
            () => {
                alertas("success", data ? "Paciente actualizado" : "Paciente registrado", "Operación exitosa.");

                fetchWithPagination({
                    url: urlApi.urlPatientes,
                    containerId: "container-pacientes",
                    paginationId: "paginationPatiend",
                    renderItemFn: renderPatientCard,
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

function validarFormularioPaciente() {
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombre || !correo || !telefono) {
        alertas("warning", "Campos requeridos", "Todos los campos son obligatorios.");
        return false;
    }

    if (nombre.length > 100) {
        alertas("warning", "Nombre muy largo", "El nombre no debe superar los 100 caracteres.");
        return false;
    }

    if (correo.length > 100) {
        alertas("warning", "Correo muy largo", "El correo no debe superar los 100 caracteres.");
        return false;
    }

    if (telefono.length > 10) {
        alertas("warning", "Teléfono muy largo", "El teléfono no debe superar los 10 caracteres.");
        return false;
    }

    return true;
}


document.getElementById("btnAgregarPaciente").addEventListener("click", () => {
    renderPatientForm(); // Modo registrar
});
