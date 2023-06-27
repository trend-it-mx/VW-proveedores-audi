import { useEffect } from 'react';
import { useFormikContext, Field } from 'formik';

const PuntosRubroField = ({ idx, puntosRubros, setPuntosRubros }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const { preguntas } = values.rubros[idx];
    const puntos = preguntas?.length
      ? preguntas.reduce(
          (acum, pregunta) =>
            pregunta?.puntos_pregunta ? acum + pregunta.puntos_pregunta : acum,
          0
        )
      : 0;
    setFieldValue(`rubros.${idx}.puntos_rubro`, puntos);
    setPuntosRubros((prev) => ({
      ...prev,
      [idx]: puntos,
    }));
  }, [idx, setFieldValue, setPuntosRubros, values.rubros]);

  return (
    <div className="group relative z-0 w-full">
      <Field
        name={`rubros.${idx}.puntos_rubro`}
        type="number"
        placeholder=" "
        value={puntosRubros[idx]}
        disabled
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-600 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
      />
      <label
        htmlFor={`rubros.${idx}.puntos_rubro`}
        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 "
      >
        Total de puntos del rubro:
      </label>
    </div>
  );
};

export default PuntosRubroField;
