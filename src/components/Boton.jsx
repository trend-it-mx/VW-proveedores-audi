import { Tema, Tipo } from '@/utils/Types';
import { colorPrincipal } from '@/utils/constants';

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
      className={`flex h-12 w-48 min-w-fit items-center justify-center gap-3 border-2 border-black px-3 text-center text-lg  bq-back `}
    >
      {tipo === Tipo.agregar ? (
        <span className="-mt-2 text-4xl">+</span>
      ) : (
        <></>
      )}{' '}
      <span className="-mt-1 text-xl">{texto}</span>
    </button>
  );
};
export default Boton;
