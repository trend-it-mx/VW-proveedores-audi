import { Tema, Tipo } from '@/utils/Types';
import { colorPrincipal } from '@/utils/constants';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImport
} from "@fortawesome/free-solid-svg-icons";

const Boton = ({ tipo, texto, tema, onClick, type, className }) => {
  let colores = '';
  switch (tema) {
    case Tema.negro:
      colores = 'bg-black text-white';
      break;
    case Tema.azul:
      colores = `bg-${colorPrincipal} text-white`;
      break;
    default:
      colores = 'bg-white text-black hover:bg-blue-200 ';
  }
  return (
    <button
      type={type}
      onClick={onClick}
      // className={`flex h-12 w-48 min-w-fit items-center justify-center gap-3 rounded-2xl border-2 border-black px-3 text-center text-lg ${colores} ${className}`}
      // className={`flex h-12 w-48 min-w-fit items-center justify-center gap-3 border-2 border-black px-3 text-center text-lg  bq-back `}
      className={`inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-black to-zinc-600 leading-normal text-xs ease-in tracking-tight-rem shadow-xs bg-150 bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md `}>      
      {tipo === Tipo.agregar ? (
        <FontAwesomeIcon icon={faFileImport} className="text-withe"/>  
      ) : (
        <></>
      )}{' '}
        {texto}
    </button>
  );
};
export default Boton;
