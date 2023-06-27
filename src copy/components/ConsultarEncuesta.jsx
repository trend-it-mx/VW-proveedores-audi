import { Tema } from '@/utils/Types';
import Image from 'next/image';
import Boton from './Boton';

const ConsultarEncuestas = ({ nombre, rol, mensajes }) => {
  return (
    <div>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-row items-center gap-4">
          <h1 className="w-full  font-bold">Inicio</h1>
          <Boton texto="Encuestas" title="Encuestas" tema={Tema.azul}></Boton>
        </div>
        <div className="items-centercol-span-1 flex flex-col gap-2 py-3">
          <Image
            src="/assets/images/ConsultarEncuestas.png"
            alt="Lápiz escribiendo"
            width="200"
            height="200"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 border-black bg-vw_dark_blue text-base font-light text-white">
        <div className="justify-items-center border-2 border-black py-3 pl-4 text-base font-light text-white">
          <label>Nombre:</label>
        </div>
        <div className="justify-items-center border-2 border-black bg-white py-3 pl-4 text-base font-light text-black">
          <label>{nombre}</label>
        </div>
        <div className="justify-items-center border-2 border-black py-3 pl-4 text-base font-light text-white">
          <label>Rol:</label>
        </div>
        <div className="justify-items-center border-2 border-black bg-white py-3 pl-4 text-base font-light text-black">
          <label>{rol}</label>
        </div>
      </div>
      <div className="grid  justify-items-center border-2 border-black bg-vw_dark_blue py-3 mt-4  pl-4 text-base font-light text-white">
        <label>Mensajes</label>
      </div>
      <div className="grid justify-items-start border-2 border-black  py-3   pl-4 text-base font-light text-black">
        <label>{mensajes}</label>
      </div>
    </div>
  );
};
export default ConsultarEncuestas;
