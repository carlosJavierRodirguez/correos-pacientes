export function alertas(icono, titulo, texto, options = {}) {
    return Swal.fire({
        icon: icono,
        title: titulo,
        text: texto,
        confirmButtonText: options.confirmButtonText || "Aceptar", // Texto del botón de confirmación
        cancelButtonText: options.cancelButtonText || "Cancelar", // Texto del botón de cancelación
        showCancelButton: options.showCancelButton || false, // Mostrar botón de cancelar
        ...options // Permite pasar opciones adicionales si es necesario
    });
}