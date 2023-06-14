import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Boton from '@/components/Boton';
import Registro from '@/components/RegistroRubro';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { Tema, Tipo } from '@/utils/Types';
import { toast } from 'react-toastify';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const DataTable = dynamic(() => import('../../../components/DataTableRubro'), {
  ssr: false,
});
const Rubros = ({ data, error }) => {
  const [actualizar, setActualizar] = useState({
    activo: false,
    idDato: undefined,
    idFila: undefined,
  });
  const [rubros, setRubros] = useState(
    data.map((rubro) => ({
      id: rubro.ID_RUBRO,
      estatus: rubro.ESTATUS,
      rubro: rubro.DESC_RUBRO,
      en_uso: rubro.EN_USO,
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
          texto="Agregar rubro"
          tema={Tema.blanco}
          onClick={() => setActualizar((prev) => ({ ...prev, activo: true }))}
        />
        <DataTable
          rows={rubros}
          setActualizar={setActualizar}
          setData={setRubros}
        />
        <Registro
          actualizar={actualizar}
          setActualizar={setActualizar}
          data={rubros}
          setData={setRubros}
        />
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
      `${config.url.API_URL}/api/administracion/encuestas/rubros/`
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

Rubros.auth = true;
Rubros.roles = ['Administrador'];
export default Rubros;
