import Link from 'next/link';
import { Tipos } from '@/utils/Types';
import { useRouter } from 'next/router';

const MenuOpcion = ({
  opcion,
  idx,
  tipo,
  activo,
  setActivo,
  setMenuActivo,
}) => {
  const router = useRouter();
  return (
    <li
      key={opcion.nombre}
      className={`flex justify-around px-2 ${
        idx !== undefined && idx === activo
          ? 'text-vw_light_blue'
          : 'text-white'
      }`}
    >
      {opcion.subopciones || router.pathname === opcion.ruta ? (
        <button
          className="flex w-full items-center justify-between px-2 transition-colors duration-500 ease-in-out hover:text-vw_light_blue"
          onClick={() => {
            if (router.pathname === opcion.ruta) {
              setMenuActivo(false);
              setActivo({});
              return;
            }
            setActivo?.((act) =>
              tipo === Tipos.Opcion
                ? { opcion: idx }
                : { ...act, subopcion: idx }
            );
          }}
        >
          <span>{opcion.nombre}</span>
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M9 6a1.7 1.7 0 0 1-.47 1.18L3.93 12 3 11.06l4.61-4.82a.36.36 0 0 0 0-.48L3 .94 3.93 0l4.6 4.82A1.72 1.72 0 0 1 9 6z"></path>
          </svg>
        </button>
      ) : (
        <Link href={opcion.ruta || '/'}>
          <a className="flex w-full items-center justify-between px-2 transition-colors duration-500 ease-in-out hover:text-vw_light_blue">
            <span>{opcion.nombre}</span>
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M9 6a1.7 1.7 0 0 1-.47 1.18L3.93 12 3 11.06l4.61-4.82a.36.36 0 0 0 0-.48L3 .94 3.93 0l4.6 4.82A1.72 1.72 0 0 1 9 6z"></path>
            </svg>
          </a>
        </Link>
      )}
    </li>
  );
};
export default MenuOpcion;
// # sourceMappingURL=MenuOpcion.jsx.map
