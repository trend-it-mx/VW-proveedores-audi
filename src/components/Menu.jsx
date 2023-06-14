import { useState } from 'react';
import { opciones } from '@/utils/opcionesMenu';
import { Tipos } from '@/utils/Types';
import MenuOpcion from './MenuOpcion';

const Menu = ({ menuActivo, setMenuActivo }) => {
  const [activo, setActivo] = useState({});
  return (
    <div
      className={`absolute z-50 h-screen w-screen bg-vw_dark_blue px-16 py-7 transition-all delay-100 duration-300 ${
        menuActivo
          ? 'translate-x-0 overflow-hidden opacity-100'
          : '-translate-x-full overflow-auto opacity-0'
      }`}
    >
      <div className="h-full w-full text-white">
        <button
          className="mb-20 flex items-center gap-2"
          onClick={() => {
            setMenuActivo(false);
            setActivo({});
          }}
        >
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="m21.474 3.467-.942-.941L12 11.059 3.466 2.526l-.94.941L11.059 12l-8.533 8.532.94.942L12 12.941l8.532 8.533.942-.942L12.941 12z"></path>
          </svg>
          <span className="text-xs">Cerrar menú</span>
        </button>
        <div className="grid grid-cols-3 gap-20 px-10 text-2xl font-light">
          <ul className="flex flex-col gap-6">
            {opciones &&
              opciones.map((opcion, idx) => (
                <MenuOpcion
                  key={opcion.nombre}
                  opcion={opcion}
                  idx={idx}
                  tipo={Tipos.Opcion}
                  activo={activo.opcion}
                  setMenuActivo={setMenuActivo}
                  setActivo={setActivo}
                />
              ))}
          </ul>
          <ul className="flex flex-col gap-6">
            {activo.opcion !== undefined &&
              opciones[activo.opcion]?.subopciones &&
              opciones[activo.opcion]?.subopciones?.map((opcion, idx) => (
                <MenuOpcion
                  key={opcion.nombre}
                  opcion={opcion}
                  idx={idx}
                  tipo={Tipos.Subopcion}
                  activo={activo.subopcion}
                  setMenuActivo={setMenuActivo}
                  setActivo={setActivo}
                />
              ))}
          </ul>
          <ul className="flex flex-col gap-6">
            {activo.subopcion !== undefined &&
              activo.opcion !== undefined &&
              opciones[activo.opcion]?.subopciones?.[
                activo.subopcion
              ]?.subopciones?.map((opcion) => (
                <MenuOpcion
                  key={opcion.nombre}
                  opcion={opcion}
                  setActivo={setActivo}
                  setMenuActivo={setMenuActivo}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Menu;
// # sourceMappingURL=Menu.jsx.map
