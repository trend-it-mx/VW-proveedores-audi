import Main from '@/templates/Main';
// import { getSession } from 'next-auth/react';
import BotonesIntermedias from '@/components/BotonesIntermedias';
// import comprobarPermisos from '@/utils/comprobarPermisos';

const Administracion = () => {
  return (
    <Main>
      <BotonesIntermedias />
    </Main>
  );
};

Administracion.auth = true;
Administracion.roles = ['Administrador'];

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   return comprobarPermisos(session, 'Administrador');
// };

export default Administracion;
