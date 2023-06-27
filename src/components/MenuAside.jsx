import Link from 'next/link';
import { catOpciones, catAside } from '@/utils/opcionesMenu';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShop,faUser,faSignOut, faBars
} from "@fortawesome/free-solid-svg-icons";
const MenuAside = () => {
  // const [opcBotones, setOpcBotones] = useState();
  // const router = useRouter();
  // useEffect(() => {
  //   const ruta = catOpciones.find((opc) => opc.ruta === router.pathname);
  //   console.log(ruta)
  //   setOpcBotones(
  //     ruta.hijos.map((hijo) => catOpciones.find((opc) => opc.ruta === hijo))
  //   );
  // }, [router.pathname]);
  // console.log(opcBotones)
  const [opcBotones, setOpcBotones] = useState();
  const router = useRouter();
  useEffect(() => {
    const ruta = catOpciones.find((opc) => opc.ruta === router.pathname);
    console.log(ruta)
    setOpcBotones(
      // ruta.hijos.map((hijo) => catOpciones.find((opc) => opc.ruta === hijo))
    );
  }, [router.pathname]);
  

  return (
    <>
        <aside mini="true" className="fixed inset-y-0 left-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto transition-all duration-200 ease-in-out -translate-x-full bg-zinc-910 border-0 shadow-none xl:ml-6 dark:bg-slate-850 z-990 max-w-64 rounded-2xl xl:translate-x-0" id="sidenav-main">
          <div className="h-20">
            <i className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times text-slate-400 dark:text-white xl:hidden" aria-hidden="true"></i>
            <a className="block px-12 py-6 m-0 text-sm whitespace-nowrap text-slate-700 dark:text-white" href="https://www.audi.com.mx/" target="_blank">
              <img src="/assets/images/210211_Audi_Mexico_Logo_red_white.png" className="inline-block h-full max-w-full transition-all duration-200 ease-in-out max-h-10 dark:hidden" alt="main_logo" />
              <img src="/assets/images/210211_Audi_Mexico_Logo_red_white.png" className="hidden h-full max-w-full transition-all duration-200 ease-in-out max-h-10 dark:inline-block" alt="main_logo" />            
            </a>
          </div>    
          <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="items-center block w-full h-auto grow basis-full" id="sidenav-collapse-main">
            <ul className="flex flex-col pl-0 mb-0 list-none">
            {catAside && catAside.hijos.map((opc) => (
                <li className="mt-0.5 w-full">          
                  <a className="after:ease-in-out after:font-awesome-5-free ease-in-out text-sm leading-default py-2.7 my-0 mx-2 flex items-center whitespace-nowrap rounded-lg bg-stone-200 px-4 font-semibold text-slate-700 transition-all after:ml-auto after:inline-block after:rotate-180 after:font-bold after:text-white after:text-slate-800 after:antialiased after:transition-all after:duration-200 after:content-['\f107']text-white opacity-80" >
                    <div className="stroke-none flex h-8 w-8 items-center justify-center rounded-lg bg-center fill-current p-2.5 text-center text-black">
                      <FontAwesomeIcon icon={faShop} className="text-sm leading-normal text-black"/>
                    </div>
                    <span className="ml-1 duration-300 opacity-100 pointer-events-none ease dark:text-white text-slate-700">{opc.nombre}</span> 
                    
                  </a>
                  <div className="h-auto overflow-hidden transition-all duration-200 ease-in-out" id="dashboardsExamples">
                    <ul className="flex flex-wrap mb-0 ml-6 list-none transition-all duration-200 ease-in-out">
                      {opc && "hijos" in opc  && opc.hijos.map((opcH) => (
                        <li className="w-full">
                          <Link key={opcH.nombre} href={opcH.ruta}>
                            <a className={`ease-in-out py-2.7 ml-5.4 pl-4 leading-default text-sm relative my-0 mr-2 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium shadow-none transition-colors  text-white  ${ opcH.ruta ==  router.pathname ? 'opacity-100': 'opacity-50' }`}>
                              <span className="w-0 text-center transition-all duration-200 ease-in-out opacity-0 pointer-events-none"> L </span>                    
                              <span className="transition-all duration-100 pointer-events-none ease"> {opcH.nombre}</span>
                            </a>
                          </Link>
                        </li> 
                      ))}
                    </ul>
                  </div>
                </li>

              ))}
            </ul>
          </div>
        </aside>
    </>
  );
};
export default MenuAside;
