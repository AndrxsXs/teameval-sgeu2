export default function eventDispatcher(event, response, severity = "success") {
  // console.log("Evento de respuesta: ", response);
  let message;
  if (typeof response === "string") {
    message = response;
  } else if (response.includes("[HTTP")) {
    message = "Error interno del servidor, inténtelo de nuevo más tarde.";
  } else {
    message =
      response.response &&
      response.response.data &&
      response.response.data.error
        ? `${response.response.data.error}`
        : // : `${response.message}`;
        `${response.data.message}`
        ? `${response.data.message}`
        : "Error interno del servidor, inténtenlo de nuevo más tarde.";
  }

  window.dispatchEvent(
    new CustomEvent(`${event}`, {
      detail: {
        message: message,
        severity: severity,
      },
    })
  );
}
