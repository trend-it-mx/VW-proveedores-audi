import Main from '@/templates/Main';
import BotonesIntermedias from '@/components/BotonesIntermedias';

// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const Parametros = () => {
  return (
    <Main>
      <BotonesIntermedias />
    </Main>
  );
};

Parametros.auth = true;
Parametros.roles = ['Administrador'];

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   return comprobarPermisos(session, 'Administrador');
// };
export default Parametros;
