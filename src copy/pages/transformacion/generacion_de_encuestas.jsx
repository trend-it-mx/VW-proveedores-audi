import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { toast } from 'react-toastify';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const DataTable = dynamic(
  () => import('../../components/DataTableGeneracion'),
  {
    ssr: false,
  }
);
const GeneracionDeEncuestas = ({ data, error }) => {
  const [ingestaUsuarios] = useState(
    data.map((generacionEncuestas) => ({
      id: generacionEncuestas.ID_REGISTRO,
      idEncuesta: generacionEncuestas.ID_ENCUESTA,
      idUsuario: generacionEncuestas.USUARIO_ENCUESTADO,
      name: generacionEncuestas.USUARIO_ENCUESTADO_NOMBRE,
      email: generacionEncuestas.USUARIO_ENCUESTADO_EMAIL,
      rol: generacionEncuestas.ROL_ENCUESTADO,
      estatus: generacionEncuestas.ESTATUS,
      subRows: undefined,
    }))
  );

  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);

  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <div className="flex w-full flex-col items-center gap-4">
        <DataTable rows={ingestaUsuarios} />
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
      `${config.url.API_URL}/api/transformacion/generacion/`
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

GeneracionDeEncuestas.auth = true;
GeneracionDeEncuestas.roles = ['Key user'];

export default GeneracionDeEncuestas;
