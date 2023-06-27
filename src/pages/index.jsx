import Main from '@/templates/Main';
import BotonesIntermedias from '@/components/BotonesIntermedias';
// import { getSession } from 'next-auth/react';
import Encuestados from '@/components/Encuestados';
// import { config } from '@/utils/constants';
import { useContext } from 'react';
import { UserContext } from '@/components/context';

const Inicio = () => {
  const userDetails = useContext(UserContext);
   console.log(userDetails)
  // const Inicio = ({ fullName, roles }) => {
  return !userDetails.roles.includes('Solicitante') &&
    !userDetails.roles.includes('Comprador') 
    ? (
    // return !roles.includes('Solicitante') && !roles.includes('Comprador') ? (
    <Main>
      {/* <BotonesIntermedias /> */}
      <div className="border-black/12.5 dark:shadow-dark-xl shadow-xl dark:bg-slate-850 relative flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border" >
        <div className="border-b-black/12.5 flex rounded-t-2xl border-b-0 border-solid p-4 pb-0" >
          <h6 className="my-auto dark:text-white">Bienvenido {userDetails.full_name}!</h6>
        </div>
        <div className="flex-auto p-4 mt-1">          
            <div className="h-100 relative block rounded-xl bg-[url('https://www.audi.com.mx/content/dam/nemo/mx/Home/home_rsegt_2023_16x9.jpg?imwidth=1440')] bg-cover transition-opacity duration-300 ease-linear" >
            </div>          
        </div>
      </div>
    </Main>
  ) : (
    <Encuestados fullName={userDetails.full_name} roles={userDetails.roles} />
  );
};

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   const res = await fetch(
//     `${config.url.API_URL}/api/usuarios/mensajes/${session?.user?.user_name}`
//   );

//   const data = await res.json();

//   return {
//     props: {
//       fullName: session?.user?.full_name || '',
//       roles: session?.user?.roles || [],
//       mensajes: data.map((mensaje) => ({
//         mensaje: mensaje.MENSAJE,
//         tipo: mensaje.TIPO_MENSAJE,
//       })),
//     },
//   };
// };

Inicio.auth = true;
export default Inicio;
