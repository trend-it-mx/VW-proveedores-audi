import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { Tema } from '@/utils/Types';
import Image from 'next/image';
import Boton from '@/components/Boton';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck, faFileImport
} from "@fortawesome/free-solid-svg-icons";


const Encuestados = ({ fullName, roles }) => {
  const router = useRouter();
  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
{/* user-check */}
      <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 overflow-hidden break-words bg-white border-0 shadow-3xl dark:bg-slate-850 rounded-2xl bg-clip-border" >
        <div className="flex flex-wrap -mx-3">
          <div className="flex-none w-auto max-w-full px-3">
            <div className="relative inline-flex items-center justify-center text-base text-black transition-all duration-200 ease-in-out h-19 w-19 rounded-xl" >
              <FontAwesomeIcon icon={faUserCheck} className="min-h-9"/>
            </div>
          </div>
          <div className="flex-none w-auto max-w-full px-3 my-auto">
            <div className="h-full">
              <h5 className="mb-1 dark:text-white">{fullName}</h5>
              <p className="mb-0 text-sm font-semibold leading-normal dark:text-white dark:opacity-60" >
                {roles.map((rol) => (
                    <a key="rol">{rol}, </a>
                  ))}
              </p>
            </div>
          </div>
          <div
            className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
            <div className="relative right-0">
              <ul>
                <li className="z-30 flex-auto text-center">          
                  <Boton
                      texto="Encuestas"
                      title="Encuestas"
                      tema={Tema.azul}
                      onClick={() => router.push(`/encuestas`)}
                    ></Boton>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>




      
      {/* <div>
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full flex-row items-center gap-4">
            <h1 className="w-full  font-bold"></h1>
            
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
        <div className="grid grid-cols-4 border-black bg-vw_dark_blue">
          <div className="justify-items-center border-2 border-r-0 border-black py-3 pl-4 text-xl font-bold text-white">
            <h3>Nombre:</h3>
          </div>
          <div className="justify-items-center border-2 border-r-0 border-black bg-white py-3 pl-4 text-base font-light text-black">
            <p>{fullName}</p>
          </div>
          <div className="justify-items-center border-2 border-r-0 border-black py-3 pl-4 text-xl font-bold text-white">
            <h3>Rol:</h3>
          </div>
          <div className="justify-items-center border-2 border-black bg-white py-3 pl-4 text-base font-light text-black">
            {roles.map((rol) => (
              <p key="rol">{rol}</p>
            ))}
          </div>
        </div> */}
        {/* <div className="grid font-bold justify-items-center border-2 border-b-0 border-black bg-vw_dark_blue py-2 mt-4  pl-4 text-xl text-white">
          <h3>Mensajes</h3>
        </div>
        <div className="flex flex-col border-2 border-black text-base font-light text-black">
          {mensajes ? (
            mensajes.map(({ mensaje, tipo }, idx) => (
              <div
                key={idx}
                className={`flex items-center ${
                  idx !== mensajes.length - 1 ? 'border-b border-black' : ''
                } w-full h-full`}
              >
                <div className="px-1 flex items-center justify-center border-r border-black">
                  <Image
                    alt="icono del tipo de mensaje"
                    src={`/assets/images/${tipo}.png`}
                    width="32"
                    height="32"
                  />
                </div>
                <p className="pl-2">{mensaje}</p>
              </div>
            ))
          ) : (
            <p>No hay mensajes</p>
          )}
        </div> */}
      {/* </div> */}
    </Main>
  );
};
export default Encuestados;
