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
    !userDetails.roles.includes('Comprador') ? (
    // return !roles.includes('Solicitante') && !roles.includes('Comprador') ? (
    <Main>
      <BotonesIntermedias />
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
