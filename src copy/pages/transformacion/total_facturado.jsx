import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { toast } from 'react-toastify';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const formatoMexico = Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 });

const DataTable = dynamic(() => import('../../components/DataTableTotal'), {
  ssr: false,
});
const TotalFacturado = ({ data, error }) => {
  const [ingestaUsuarios, setIngestaUsuarios] = useState(
    data.map((totalFacturado) => ({
      purchase_order: totalFacturado.PURCH_DOC,
      totalEuros: formatoMexico.format(totalFacturado.TOTAL),
      porcentajeFacturacion: totalFacturado.PORC_FACTURADO,
      estado: totalFacturado.ESTADO,
      encuesta: totalFacturado.ENCUESTA,
      subRows: undefined,
    }))
  );
  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);
  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <div className="flex w-full flex-col items-center gap-4">
        <DataTable rows={ingestaUsuarios} setData={setIngestaUsuarios} />
      </div>
    </Main>
  );
};
export const getServerSideProps = async () => {
  // export const getServerSideProps = async (ctx) => {
  //   const session = await getSession(ctx);
  let data = [];
  let error = false;
  try {
    const res = await fetch(
      `${config.url.API_URL}/api/transformacion/total_facturado/`
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

TotalFacturado.auth = true;
TotalFacturado.roles = ['Key user'];

export default TotalFacturado;
