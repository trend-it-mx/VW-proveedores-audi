import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo, useState, useContext } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Menu from '@/components/Menu';
import generateBreadcrumbs from '@/utils/generateBreadcrumbs';
import { UserDispatchContext } from '@/components/context';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShop
} from "@fortawesome/free-solid-svg-icons";
// import { signOut } from 'next-auth/react';

const Main = (props) => {
  const router = useRouter();
  const setUserDetails = useContext(UserDispatchContext);
  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(router.asPath.split('?')[0]),
    [router.asPath]
  );
  const [menuActivo, setMenuActivo] = useState(false);
  return (
    <main className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68 rounded-xl">      
      {/* <Menu menuActivo={menuActivo} setMenuActivo={setMenuActivo} /> */}
      <aside mini="false" className="fixed inset-y-0 left-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto transition-all duration-200 ease-in-out -translate-x-full bg-zinc-910 border-0 shadow-none xl:ml-6 dark:bg-slate-850 z-990 max-w-64 rounded-2xl xl:translate-x-0" id="sidenav-main">
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

            <li className="mt-0.5 w-full">          
              <a  className="after:ease-in-out after:font-awesome-5-free ease-in-out text-sm leading-default py-2.7 my-0 mx-2 flex items-center whitespace-nowrap rounded-lg bg-stone-200 px-4 font-semibold text-slate-700 transition-all after:ml-auto after:inline-block after:rotate-180 after:font-bold dark:after:text-white after:text-slate-800 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] dark:text-white dark:opacity-80" >
                <div className="stroke-none flex h-8 w-8 items-center justify-center rounded-lg bg-center fill-current p-2.5 text-center text-black">
                  <FontAwesomeIcon icon={faShop} className="text-sm leading-normal text-black"/>
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease dark:text-white text-slate-700">Dashboards</span>
              </a>
              <div className="h-auto overflow-hidden transition-all duration-200 ease-in-out" id="dashboardsExamples">
                <ul className="flex flex-wrap mb-0 ml-6 list-none transition-all duration-200 ease-in-out">
                  <li className="w-full">
                    <a className="ease-in-out py-2.7 ml-5.4 pl-4 leading-default text-sm relative my-0 mr-2 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium shadow-none transition-colors  text-white opacity-60 " href="../../pages/dashboards/landing.html">
                      <span className="w-0 text-center transition-all duration-200 ease-in-out opacity-0 pointer-events-none"> L </span>                    
                      <span className="transition-all duration-100 pointer-events-none ease"> Landing </span>
                    </a>
                  </li>
                  <li className="w-full">                  
                    <a active_page active_secondary className="ease-in-out py-2.7 ml-5.4 pl-4 leading-default text-sm relative my-0 mr-2 flex items-center whitespace-nowrap rounded-lg bg-transparent pr-4 font-semibold shadow-none transition-colors  text-white opacity-100 " href="../../pages/dashboards/default.html">                    
                      <span className="w-0 text-center transition-all duration-200 ease-in-out opacity-0 pointer-events-none"> D </span>                    
                      <span className="transition-all duration-100 pointer-events-none ease"> Default </span>
                    </a>
                  </li>                
                </ul>
              </div>
            </li>

          </ul>
        </div>
      </aside>


      
      <div className="relative w-full px-1 text-gray-700 antialiased">
        {props.meta}

        <div className="mx-10">
          <div className="flex items-center justify-between pb-8">
            {/* <button
              className="flex items-center gap-4"
              onClick={() => setMenuActivo(true)}>
              <Image
                src="/assets/images/menu.png"
                alt="Tres líneas apiladas"
                width={30}
                height={25}
              />
              <h2>Menú</h2>
            </button> */}

            {/* {process.env.NEXT_PUBLIC_SISTEMA === 'VW' ? (
              <Image
                src="/assets/images/vw.jpg"
                alt="V encima de una W dentro de un aro azul"
                width={80}
                height={80}
              />
            ) : (
              <Image
                src="/assets/images/audi.png"
                alt="logotipo de audi"
                width={140}
                height={90}
              />
            )} */}

            <button
              className="flex items-center gap-4"
              // onClick={() => signOut()}
              onClick={() => {
                setUserDetails({
                  user_name: undefined,
                  e_mail: undefined,
                  roles: [],
                  full_name: undefined,
                });
                router.push('/login');
              }}
            >
              <Image
                src="/assets/images/cerrar.png"
                alt="Flecha apuntando hacia la derecha partiendo de una puerta"
                width={30}
                height={30}
              />
              <h2>Salir</h2>
            </button>
          </div>

          <div className="mx-auto w-10/12">
            

            <div className="oveflow-x-hidden py-5 text-xl">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Main;
// # sourceMappingURL=Main.jsx.map
