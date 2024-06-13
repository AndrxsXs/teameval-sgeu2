export default function interpretEvaluationState(number) {
  let response = "";

  switch (number) {
    case 2:
      response = "En curso";
      break;
    case 3:
      response = "Finalizada";
      break;
    default:
      response = "Sin iniciar";
      break;
  }

  return response;
}
