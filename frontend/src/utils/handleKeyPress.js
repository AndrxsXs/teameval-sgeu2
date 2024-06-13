export const handleKeyPress = (e) => {
  // Permitir sólo números y teclas de control (Backspace, Borrar, flechas, etc.)
  const charCode = e.which ? e.which : e.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    e.preventDefault();
  }
};
