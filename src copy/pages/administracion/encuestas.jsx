import Main from '@/templates/Main';
import BotonesIntermedias from '@/components/BotonesIntermedias';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const Encuestas = () => {
  return (
    <Main>
      <BotonesIntermedias />
    </Main>
  );
};

Encuestas.auth = true;
Encuestas.roles = ['Administrador'];

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   return comprobarPermisos(session, 'Administrador');
// };
export default Encuestas;
