import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Boton from '@/components/Boton';
import Registro from '@/components/RegistroIngestaUsuarios';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { Tema, Tipo } from '@/utils/Types';
import { toast } from 'react-toastify';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const DataTable = dynamic(
  () => import('../../components/DataTableIngestaUsuarios'),
  {
    ssr: false,
  }
);
const Usuarios = ({ data, error, dato }) => {
  const [actualizar, setActualizar] = useState({
    activo: false,
    idDato: undefined,
    idFila: undefined,
  });
  const [ingestaUsuarios, setIngestaUsuarios] = useState(
    data.map((ingestaUsuario) => ({
      id: ingestaUsuario.ID_ARCHIVO,
      estatus: ingestaUsuario.ESTATUS,
      archivo: ingestaUsuario.NOMBRE_ARCHIVO,
      fecha_y_hora_ingesta: ingestaUsuario.FECHA_CARGA.value,
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
                        <h5 className="mb-1 dark:text-white">Ingesta de Usuarios</h5>
                      </div>
                    </div>
                    <div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
                      <div className="relative right-0">
                        <ul className="relative flex flex-wrap p-1 list-none " nav-pills role="tablist">
                          <li className="z-30 flex-auto text-center">
                          <Boton
                            tipo={Tipo.agregar}
                            texto="Agregar archivo"
                            tema={Tema.blanco}          
                            onClick={() => setActualizar((prev) => ({ ...prev, activo: true }))}
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
                  rows={ingestaUsuarios}
                  setActualizar={setActualizar}
                  setData={setIngestaUsuarios}
                />
                <Registro
                  actualizar={actualizar}
                  setActualizar={setActualizar}
                  data={data}
                  setData={setIngestaUsuarios}
                  rutaFull="api/ingesta/usuarios"
                  rutaID="api/ingesta/usuario"
                  carpetaBucket="Usuarios"
                  tabla="USUARIOS"
                  layout={dato}
                />
            </div>          
          </div>
        </div>
      
      
      {/* <div className="flex w-full flex-col items-center gap-4">
        <Boton
          tipo={Tipo.agregar}
          texto="Agregar archivo"
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
          data={data}
          setData={setIngestaUsuarios}
          rutaFull="api/ingesta/usuarios"
          rutaID="api/ingesta/usuario"
          carpetaBucket="Usuarios"
          tabla="USUARIOS"
          layout={dato}
        />
      </div> */}
    </Main>
  );
};
export const getServerSideProps = async () => {
  // export const getServerSideProps = async (ctx) => {
  //   const session = await getSession(ctx);
  let data = [];
  let dato = [];
  let error = false;
  try {
    const res = await fetch(`${config.url.API_URL}/api/ingesta/usuarios/`);
    const res2 = await fetch(
      `${config.url.API_URL}/api/administracion/parametros/lay_archivo/?tabla=USUARIOS/`
    );
    data = await res.json();
    dato = await res2.json();
  } catch {
    error = true;
  }

  return {
    // ...comprobarPermisos(session, 'Key user'),
    ...{ props: { data, dato, error } },
  };
};

Usuarios.auth = true;
Usuarios.roles = ['Key user'];

export default Usuarios;
