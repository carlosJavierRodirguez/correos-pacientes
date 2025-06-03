import { insertarDatos } from "../generica/insertarDatos.js";
import { alertas } from "../alertas/alertas.js";
import { urlApi } from "../urlApis.js";
import { fetchWithPagination } from "../generica/obtenerDatos.js";
import { renderMedicineCard } from "./getDataMedicine.js"; // asegúrate de tener esta función

// Mostrar modal para registrar / editar medicamento
export function renderMedicineForm(data = null) {
    const tituloModal = document.getElementById("tituloModalMedicamento");
    const nombreInput = document.getElementById("nombre-medicamento");
    const farmaciaInput = document.getElementById("farmacia");
    const fechaInput = document.getElementById("fecha");
    const botonGuardar = document.getElementById("btnGuardarMedicamento");

    // Cambiar título y valores del formulario
    tituloModal.innerHTML = data
        ? 'Editar Medicamento <i class="fa-solid fa-pills"></i>'
        : 'Agregar Medicamento <i class="fa-solid fa-pills"></i>';

    nombreInput.value = data?.name || "";
    farmaciaInput.value = data?.pharmaceuticals || "";
    fechaInput.value = data?.expiration || "";

    const modal = new bootstrap.Modal(document.getElementById("modalMedicamento"));
    modal.show();

    // Limpiar eventos previos del botón guardar
    const nuevoBoton = botonGuardar.cloneNode(true);
    botonGuardar.parentNode.replaceChild(nuevoBoton, botonGuardar);

    // Evento de guardar/actualizar
    nuevoBoton.addEventListener("click", async () => {
        if (!validarFormularioMedicamento()) return;

        const medicineData = {
            name: nombreInput.value.trim(),
            pharmaceuticals: farmaciaInput.value.trim(),
            expiration: fechaInput.value
        };

        if (data?.id) {
            medicineData.id = data.id;
        }

        await insertarDatos(
            urlApi.urlMedicines,
            medicineData,
            () => {
                alertas("success", data ? "Medicamento actualizado" : "Medicamento registrado", "Operación exitosa.");

                fetchWithPagination({
                    url: urlApi.urlMedicines,
                    containerId: "container-medicine",
                    paginationId: "pagination-medicine",
                    renderItemFn: renderMedicineCard,
                    itemsPerPage: 8
                });

                const modal = bootstrap.Modal.getInstance(document.getElementById('modalMedicamento'));
                modal.hide();

            },
            (error) => {
                alertas("error", "Error", error.message);
            }
        );
    });
}

// Validación de campos
function validarFormularioMedicamento() {
    const nombre = document.getElementById("nombre-medicamento").value.trim();
    const farmacia = document.getElementById("farmacia").value.trim();
    const fecha = document.getElementById("fecha").value;

    if (!nombre || !farmacia || !fecha) {
        alertas("warning", "Campos requeridos", "Todos los campos son obligatorios.");
        return false;
    }

    if (nombre.length > 100) {
        alertas("warning", "Nombre muy largo", "El nombre no debe superar los 100 caracteres.");
        return false;
    }

    if (farmacia.length > 100) {
        alertas("warning", "Nombre de la farmacia muy largo", "No debe superar los 100 caracteres.");
        return false;
    }
    // Validación de fecha: no se permiten fechas anteriores a hoy
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Eliminar horas para comparar solo fecha

    if (fechaSeleccionada < hoy) {
        alertas("warning", "Fecha inválida", "La fecha de vencimiento debe ser posterior a hoy.");
        return false;
    }
    return true;
}

document.getElementById("btnAgregarMedicamento").addEventListener("click", () => {
    renderMedicineForm(); // Modo registrar
});
