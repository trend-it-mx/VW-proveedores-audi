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
      <label htmlFor={`rubros.${idx}.puntos_rubro`} className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80" >
        Total de puntos del rubro:
      </label>
      <Field
        name={`rubros.${idx}.puntos_rubro`}
        type="number"
        placeholder=" "
        value={puntosRubros[idx]}
        disabled
        className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none"
      />
      
    </div>
  );
};

export default PuntosRubroField;
