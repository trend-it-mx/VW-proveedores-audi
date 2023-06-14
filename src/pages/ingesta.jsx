import Main from '@/templates/Main';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';
import BotonesIntermedias from '../components/BotonesIntermedias';

const Ingesta = () => {
  return (
    <Main>
      <BotonesIntermedias />
    </Main>
  );
};

Ingesta.auth = true;
Ingesta.roles = ['Key user'];

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   return comprobarPermisos(session, 'Key user');
// };
export default Ingesta;
