// eslint-disable-next-line import/prefer-default-export
export const formatField = (palabra) => {
  const conEspacio = palabra.replaceAll('_', ' ');
  const conMayuscula = conEspacio.charAt(0).toUpperCase() + conEspacio.slice(1);
  return conMayuscula;
};
// # sourceMappingURL=formatField.js.map
