import { signIn } from 'next-auth/react';

const comprobarPermisos = (session, rolesPagina) => {
  try {
    if (!session?.user) {
      throw new Error('No se ha autenticado');
    }

    const rolesUsuario = session.user?.roles;
    if (
      Array.isArray(rolesPagina)
        ? !rolesPagina.some((rol) => rolesUsuario.includes(rol))
        : !rolesUsuario.includes(rolesPagina)
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }
  } catch (e) {
    console.log(e);
    signIn();
  }

  return { props: {} };
};
export default comprobarPermisos;
