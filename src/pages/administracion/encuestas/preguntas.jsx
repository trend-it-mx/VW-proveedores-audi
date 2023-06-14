import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Boton from '@/components/Boton';
import Registro from '@/components/RegistroPregunta';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { Tema, Tipo } from '@/utils/Types';
import { toast } from 'react-toastify';

// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const DataTable = dynamic(
  () => import('../../../components/DataTablePregunta'),
  {
    ssr: false,
  }
);
const Preguntas = ({ data, error }) => {
  const [actualizar, setActualizar] = useState({
    activo: false,
    idDato: undefined,
    idFila: undefined,
  });
  const [preguntas, setPreguntas] = useState(
    data.map((pregunta) => ({
      id: pregunta.ID_PREGUNTA,
      estatus: pregunta.ESTATUS,
      pregunta: pregunta.DESC_PREGUNTA,
      en_uso: pregunta.EN_USO,
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
          texto="Agregar pregunta"
          tema={Tema.blanco}
          onClick={() => setActualizar((prev) => ({ ...prev, activo: true }))}
        />
        <DataTable
          rows={preguntas}
          setActualizar={setActualizar}
          setData={setPreguntas}
        />
        <Registro
          actualizar={actualizar}
          setActualizar={setActualizar}
          data={preguntas}
          setData={setPreguntas}
        />
      </div>
    </Main>
  );
};

Preguntas.auth = true;
Preguntas.roles = ['Administrador'];

// export const getServerSideProps = async (ctx) => {
export const getServerSideProps = async () => {
  //   const session = await getSession(ctx);
  let data = [];
  let error = false;
  try {
    const res = await fetch(
      `${config.url.API_URL}/api/administracion/encuestas/preguntas/`
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

export default Preguntas;
