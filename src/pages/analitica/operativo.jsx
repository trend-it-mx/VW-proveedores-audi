import Main from '@/templates/Main';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const Operativo = () => {
  return (
    <Main>
      <iframe
        className="w-full h-screen"
        src="https://lookerstudio.google.com/embed/reporting/f077e873-018d-4703-91a8-42dc499514fd"
      ></iframe>
    </Main>
  );
};

Operativo.auth = true;
Operativo.roles = ['Key user', 'Analista'];

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   return comprobarPermisos(session, 'Key user');
// };

export default Operativo;
