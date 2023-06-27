import Main from '@/templates/Main';
import BotonesIntermedias from '@/components/BotonesIntermedias';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const Calendario = () => {
  return (
    <Main>
      <BotonesIntermedias />
    </Main>
  );
};

Calendario.auth = true;
Calendario.roles = ['Administrador'];

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   return comprobarPermisos(session, 'Administrador');
// };
export default Calendario;
