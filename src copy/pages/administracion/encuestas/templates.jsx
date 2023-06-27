import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Boton from '@/components/Boton';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { useRouter } from 'next/router';
import { config } from '@/utils/constants';
import { Tema, Tipo } from '@/utils/Types';
import { toast } from 'react-toastify';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const DataTable = dynamic(
  () => import('../../../components/DataTableTemplate'),
  {
    ssr: false,
  }
);
const Templates = ({ data, error }) => {
  const router = useRouter();
  const [templates, setTemplates] = useState(
    data.map((template) => ({
      id: template.ID_TEMPLATE,
      estatus: template.ESTATUS,
      total_preguntas_template: template.TOTAL_PREGUNTAS_TEMPLATE,
      en_uso: template.EN_USO ? 'SÍ' : 'NO',
      template: template.NOMBRE_TEMPLATE,
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
          texto="Agregar Template"
          tema={Tema.blanco}
          onClick={() => router.push(`templates/agregar_template`)}
        />
        <DataTable rows={templates} setData={setTemplates} />
      </div>
    </Main>
  );
};
// export const getServerSideProps = async (ctx) => {
export const getServerSideProps = async () => {
  //   const session = await getSession(ctx);
  let data = [];
  let error = false;
  try {
    const res = await fetch(
      `${config.url.API_URL}/api/administracion/encuestas/templates/`
    );
    data = await res.json();
  } catch {
    error = true;
  }
  return {
    // ...comprobarPermisos(session, 'Administrador'),
    ...{
      props: {
        data,
        error,
      },
    },
  };
};

Templates.auth = true;
Templates.roles = ['Administrador'];
export default Templates;
// # sourceMappingURL=templates.jsx.map
