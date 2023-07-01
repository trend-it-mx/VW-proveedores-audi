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
      <div class="relative flex flex-col ">
          <div class="table-responsive">
              <div className="w-full mx-auto p-2">
                <div className="relative flex flex-col flex-auto min-w-0 p-4  overflow-hidden break-words bg-white border-0 shadow-3xl dark:bg-slate-850 rounded-2xl bg-clip-border">
                  <div className="flex flex-wrap -mx-3">
                    <div className="flex-none w-auto max-w-full px-3 my-auto">
                      <div className="h-full">
                        <h5 className="mb-1 dark:text-white">Templates</h5>
                      </div>
                    </div>
                    <div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
                      <div className="relative right-0">
                        <ul className="relative flex flex-wrap p-1 list-none " nav-pills role="tablist">
                          <li className="z-30 flex-auto text-center">
                          <Boton
                              tipo={Tipo.agregar}
                              texto="Agregar Template"
                              tema={Tema.blanco}
                              onClick={() => router.push(`templates/agregar_template`)}
                            />
                          </li>                  
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center">  
                <DataTable
                  rows={templates}
                  setData={setTemplates}
                />                
              </div>
            </div>
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
