export default function eventDispatcher(event, response, severity = "success") {
  let message;
  if (typeof response === "string") {
    message = response;
  } else {
    message = response.response && response.response.data && response.response.data.error
      ? `${response.response.data.error}`
      // : `${response.message}`;
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
