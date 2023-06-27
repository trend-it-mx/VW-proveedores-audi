/* eslint-disable import/prefer-default-export */
import faker from '@faker-js/faker';

const range = (len) => {
  const arr = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};
const newPerson = () => {
  return {
    nombre: faker.name.firstName(),
    primer_apellido: faker.name.lastName(),
    segundo_apellido: faker.name.lastName(),
    correo_electronico: faker.internet.email(),
    rol: 'Administrador',
  };
};
export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map(() => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };
  return makeDataLevel();
}
// # sourceMappingURL=makeData.js.map
