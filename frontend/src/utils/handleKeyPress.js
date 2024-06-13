// export const handleKeyPress = (e) => {
//   // Permitir sólo números y teclas de control (Backspace, Borrar, flechas, etc.)
//   const charCode = e.which ? e.which : e.keyCode;
//   if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
//     e.preventDefault();
//   }
// };

// export const handleKeyPress = (e) => {
//   // Permitir sólo números (del teclado principal y numérico)
//   const keyValue = String.fromCharCode(e.which || e.keyCode);
//   const pattern = /^[0-9\b]+$/;

//   if (!pattern.test(keyValue)) {
//     e.preventDefault();
//   }
// };

export const handleKeyPress = (e) => {
  // Permitir sólo números (del teclado principal y numérico) y teclas de control
  const allowedKeys = [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Backspace', 'Delete', 'Tab', 'Enter',
    'Home', 'End', 'PageUp', 'PageDown'
  ];
  const isAllowedKey = allowedKeys.includes(e.key);
  const isNumber = /^[0-9]$/.test(e.key);

  if (!isAllowedKey && !isNumber) {
    e.preventDefault();
  }
};