import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Boton from '@/components/Boton';
import Registro from '@/components/RegistroUsuarios';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { Tema, Tipo } from '@/utils/Types';
import { toast } from 'react-toastify';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const DataTable = dynamic(
  () => import('../../components/DataTableSeguridadUsuarios'),
  {
    ssr: false,
  }
);
const Usuarios = ({ data, error }) => {
  const [actualizar, setActualizar] = useState({
    activo: false,
    dato: {
      usuario: '',
      nombre: '',
      correo_electronico: '',
      roles: [],
      estatus: '',
    },
    idx: undefined,
  });
  const [ingestaUsuarios, setIngestaUsuarios] = useState(
    data.map((ingestaUsuario) => ({
      usuario: ingestaUsuario.USER_NAME,
      nombre: ingestaUsuario.FULL_NAME,
      correo_electronico: ingestaUsuario.E_MAIL,
      roles: ingestaUsuario.ROLES,
      estatus: ingestaUsuario.ESTATUS,
      subRows: undefined,
    }))
  );

  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);

  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <div className="flex w-full flex-col items-center gap-4">
        <Boton
          tipo={Tipo.agregar}
          texto="Agregar usuario"
          tema={Tema.blanco}
          onClick={() => setActualizar((prev) => ({ ...prev, activo: true }))}
        />
        <DataTable
          rows={ingestaUsuarios}
          setActualizar={setActualizar}
          setData={setIngestaUsuarios}
        />
        <Registro
          actualizar={actualizar}
          setActualizar={setActualizar}
          setData={setIngestaUsuarios}
          registro="Registro de usuario"
        />
      </div>
    </Main>
  );
};
export const getServerSideProps = async () => {
  // export const getServerSideProps = async (ctx) => {
  // const session = await getSession(ctx);
  let data = [];
  let error = false;
  try {
    const res = await fetch(`${config.url.API_URL}/api/seguridad/usuarios/`);
    data = await res.json();
  } catch {
    error = false;
  }

  return {
    // ...comprobarPermisos(session, 'Administrador'),
    ...{ props: { data, error } },
  };
};

Usuarios.auth = true;
Usuarios.roles = ['Administrador'];

export default Usuarios;
