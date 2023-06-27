import dynamic from 'next/dynamic';
import { useEffect, useState, useContext } from 'react';
// import Boton from '@/components/Boton';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { toast } from 'react-toastify';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';
import axios from 'axios';
import { UserContext } from '@/components/context';

const DataTable = dynamic(
  () => import('@/components/DataTableUsuarioEncuestas'),
  {
    ssr: false,
  }
);
// const Encuestas = ({ data, error }) => {

const Encuestas = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const userDetails = useContext(UserContext);

  useEffect(() => {
    const peticion = async () => {
      try {
        const res = await axios.get(
          `${config.url.API_URL}/api/usuarios/encuestas/`,
          {
            params: {
              // usuario: session?.user?.user_name,
              usuario: userDetails.user_name,
            },
          }
        );
        setData(res.data);
      } catch {
        setError(true);
      }
    };

    peticion();
  });

  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);

  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <div className="flex w-full flex-col items-center gap-4">
        <DataTable rows={data} />
      </div>
    </Main>
  );
};

Encuestas.auth = true;
Encuestas.roles = ['Comprador', 'Solicitante'];

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   let data = [];
//   let error = false;
//   try {
//     const res = await axios.get(
//       `${config.url.API_URL}/api/usuarios/encuestas`,
//       {
//         params: {
//           usuario: session?.user?.user_name,

//         },
//       }
//     );
//     data = res.data;
//   } catch {
//     error = true;
//   }
//   return {
//     ...comprobarPermisos(session, ['Comprador', 'Solicitante']),
//     ...{ props: { data, error } },
//   };
// };

export default Encuestas;
