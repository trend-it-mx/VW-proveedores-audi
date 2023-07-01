import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { toast } from 'react-toastify';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const DataTable = dynamic(
  () => import('../../components/DataTableTransformacionIngesta'),
  {
    ssr: false,
  }
);
const IngestaDeUsuariosYRoles = ({ data, error }) => {
  const [ingestaUsuarios, setIngestaUsuarios] = useState(
    data.map((ingestaUsuario) => ({
      idUsuario: ingestaUsuario.USER_NAME,
      name: ingestaUsuario.FULL_NAME,
      email: ingestaUsuario.E_MAIL,
      rol: ingestaUsuario.ROL,
      estatus: ingestaUsuario.ESTATUS,
      subRows: undefined,
    }))
  );
  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);
  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
        <div class="relative flex flex-col ">
          <div class="table-responsive">
              <div className="w-full mx-auto p-2">
                <div className="relative flex flex-col flex-auto min-w-0 p-4  overflow-hidden break-words bg-white border-0 shadow-3xl dark:bg-slate-850 rounded-2xl bg-clip-border">
                  <div className="flex flex-wrap -mx-3">
                    <div className="flex-none w-auto max-w-full px-3 my-auto">
                      <div className="h-full">
                        <h5 className="mb-1 dark:text-white">Ingesta de Usuarios y Roles</h5>
                      </div>
                    </div>                                    
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center">
        <DataTable rows={ingestaUsuarios} setData={setIngestaUsuarios} />
      </div>
      </div>
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
    const res = await fetch(
      `${config.url.API_URL}/api/transformacion/ingesta/`
    );
    data = await res.json();
  } catch {
    error = true;
  }
  return {
    // ...comprobarPermisos(session, 'Key user'),
    ...{ props: { data, error } },
  };
};

IngestaDeUsuariosYRoles.auth = true;
IngestaDeUsuariosYRoles.roles = ['Key user'];

export default IngestaDeUsuariosYRoles;
