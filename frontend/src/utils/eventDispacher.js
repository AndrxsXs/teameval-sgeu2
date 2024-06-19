export default function eventDispatcher(event, response, severity = "success") {
  let message;

  if (typeof response === "string") {
    message = response;
  } else if (response.data) {
    // La respuesta del servidor incluye datos
    message =
      response.data.error || response.data.message || "Operación exitosa";
    severity = response.status >= 400 ? "danger" : "success";
  } else if (response.response) {
    // La solicitud se realizó y el servidor respondió con un código de estado
    message =
      response.response.data.error ||
      "Error interno del servidor, inténtenlo de nuevo más tarde.";
    severity = "danger";
  } else if (response.request) {
    // La solicitud se realizó pero no se recibió respuesta
    message = "No se pudo establecer una conexión con el servidor.";
    severity = "danger";
  } else {
    // Algo sucedió al configurar la solicitud que provocó un Error
    message = response.message || "Error desconocido.";
    severity = "danger";
  }

  window.dispatchEvent(
    new CustomEvent(`${event}`, {
      detail: {
        message,
        severity,
      },
    })
  );
}
