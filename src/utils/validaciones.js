/* eslint-disable no-template-curly-in-string */
import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: 'este campo es requerido',
  },
  string: {
    email: 'ingrese un email válido',
    min: 'cadena muy corta (mínimo ${min} caracteres)',
    max: 'cadena muy larga (máximo ${max} caracteres)',
  },
  number: {
    min: 'valor inválido (debe ser mayor o igual a ${min})',
    max: 'valor inválido (debe ser menor o igual a ${max})',
  },
  array: {
    min: 'valor inválido (mínimo ${min} elementos)',
  },
});

export default yup;
