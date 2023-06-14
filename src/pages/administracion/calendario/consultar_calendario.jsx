import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '@/utils/constants';

// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

const ConsultarCalendario = ({ data }) => {
  const [fechas, setFechas] = useState();
  const [fechasSolas, setFechasSolas] = useState();

  useEffect(() => {
    const dataFormateada = data.map((dato) => {
      const fecha = new Date(dato.ANIO, dato.MES - 1, dato.DIA);
      return {
        fecha: fecha.toLocaleDateString('en-US'),
        habil: dato.HABIL === 'SI',
      };
    });

    const fechasSolasFormateadas = new Set(
      data.map((dato) => {
        const fecha = new Date(dato.ANIO, dato.MES - 1, dato.DIA);
        return fecha.toLocaleDateString('en-US');
      })
    );

    setFechas(dataFormateada);
    setFechasSolas(fechasSolasFormateadas);
  }, [data]);

  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <div className="flex w-full flex-col items-center gap-4">
        <h1 className="w-full border-b-2 font-bold border-gray-600">
          Consulta de calendario
        </h1>
        <div className="grid w-full grid-cols-5">
          <div className="flex flex-col gap-5">
            <div className="col-span-1 flex flex-col gap-2">
              <p>Simbología de colores:</p>
              <div className="flex h-8 w-full text-sm ">
                <div className="h-full w-full border-y-2 border-l-2 pt-1 text-center border-gray-600">
                  Día hábil
                </div>
                <div className="h-full w-full border-2 bg-blue-300 pt-1 text-center border-gray-600">
                  Día no hábil
                </div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <p>Años cargados:</p>
              <ul className="list-disc pl-10">
                {Array.from(new Set(data.map((dato) => dato.ANIO))).map(
                  (anio) => (
                    <li key={anio}>{anio}</li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="col-span-4 px-4">
            <Calendar
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  if (fechasSolas.has(date.toLocaleDateString('en-US'))) {
                    return fechas.find(
                      (fecha) =>
                        fecha.fecha === date.toLocaleDateString('en-US')
                    ).habil
                      ? 'habil'
                      : 'inhabil';
                  }
                  return 'inexistente';
                }
                return null;
              }}
              tileDisabled={({ view }) => view === 'month'}
            />
          </div>
        </div>
      </div>
    </Main>
  );
};

ConsultarCalendario.auth = true;
ConsultarCalendario.roles = ['Administrador'];

// export const getServerSideProps = async (ctx) => {
export const getServerSideProps = async () => {
  // const session = await getSession(ctx);
  let data = [];
  let error = false;
  try {
    const res = await axios.get(
      `${config.url.API_URL}/api/administracion/calendario/`
    );
    data = res.data;
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

export default ConsultarCalendario;
// # sourceMappingURL=consultar_calendario.jsx.map
