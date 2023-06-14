import { formatField } from '@/utils/formatField';
import { Tema } from '@/utils/Types';
import Boton from './Boton';

const Registro = ({ actualizar, setActualizar, setData }) => {
  return (
    <div
      className={`${
        !actualizar.activo && 'hidden'
      } fixed top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40`}
    >
      <div className="flex w-2/3 flex-col divide-y-2 bg-white">
        <div className="w-full bg-vw_dark_blue pl-4 pt-2 pb-1 text-white">
          Registro de template
        </div>
        {actualizar.dato &&
          Object.keys(actualizar.dato).map((llave) => (
            <div key={llave} className="flex">
              <label
                htmlFor={llave}
                className="w-1/4 bg-vw_dark_blue pl-4 pt-2 pb-1 font-light text-white"
              >
                {formatField(llave)}
              </label>
              <input
                type="text"
                className="w-full pl-4"
                name={llave}
                value={actualizar.dato[llave]}
                onChange={(e) => {
                  setActualizar((previo) => {
                    const objetoNuevo = previo.dato;
                    objetoNuevo[llave] = e.target.value;
                    return { ...previo, dato: { ...objetoNuevo } };
                  });
                }}
              />
            </div>
          ))}
        <div className="flex w-full items-center justify-center gap-10 py-2">
          <Boton
            texto="Cancelar"
            tema={Tema.blanco}
            onClick={() =>
              setActualizar((prev) => ({
                ...prev,
                activo: false,
                dato: {
                  template: '',
                  total_de_preguntas: '',
                  en_uso: '',
                },
                idx: undefined,
              }))
            }
          />
          <Boton
            texto="Guardar"
            tema={Tema.azul}
            onClick={() => {
              const actualizarIdx = actualizar.idx;
              if (actualizarIdx !== undefined) {
                setData((prev) => [
                  ...prev.slice(0, actualizarIdx),
                  {
                    ...prev[actualizarIdx],
                    ...actualizar.dato,
                  },
                  ...prev.slice(actualizarIdx + 1),
                ]);
              } else {
                setData((prev) => [...prev, actualizar.dato]);
              }
              setActualizar((prev) => ({
                ...prev,
                activo: false,
                dato: {
                  template: '',
                  total_de_preguntas: '',
                  en_uso: '',
                },
                idx: undefined,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Registro;
// # sourceMappingURL=RegistroTemplate.jsx.map
