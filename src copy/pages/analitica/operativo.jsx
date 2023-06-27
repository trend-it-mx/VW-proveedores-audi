import Main from '@/templates/Main';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const Operativo = () => {
  return (
    <Main>
      <iframe
        className="w-full h-screen"
        // src="https://lookerstudio.google.com/embed/reporting/f077e873-018d-4703-91a8-42dc499514fd"
        src="https://lookerstudio.google.com/embed/reporting/1271c555-1ea1-4ad2-ace7-6cf234c736fb"
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
