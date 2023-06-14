import Link from 'next/link';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import comprobarPermisos from '@/utils/comprobarPermisos';
import { getSession } from 'next-auth/react';

const LayoutDeArchivos = () => {
  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <h1 className="mb-6 font-bold">Seleccione una opción:</h1>
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 pl-4">
        <Link href="layout_de_archivos/layout_de_archivos_de_usuarios">
          <a className="rounded-xl border-2 border-blue-300 py-2 text-center shadow-lg hover:bg-blue-300">
            Layout para archivos de Usuarios
          </a>
        </Link>
        <Link href="layout_de_archivos/layout_de_archivos_de_ordenes">
          <a className="rounded-xl border-2 border-blue-300 py-2 text-center shadow-lg hover:bg-blue-300">
            Layout para archivos de Órdenes
          </a>
        </Link>
        <Link href="layout_de_archivos/layout_de_archivos_de_escalamiento">
          <a className="rounded-xl border-2 border-blue-300 py-2 text-center shadow-lg hover:bg-blue-300">
            Layout para archivos de Escalamiento
          </a>
        </Link>
        <Link href="layout_de_archivos/layout_de_archivos_de_facturas">
          <a className="rounded-xl border-2 border-blue-300 py-2 text-center shadow-lg hover:bg-blue-300">
            Layout para archivos de Facturas
          </a>
        </Link>
      </div>
    </Main>
  );
};

LayoutDeArchivos.auth = true;

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return comprobarPermisos(session, 'Administrador');
};
export default LayoutDeArchivos;
// # sourceMappingURL=layout_de_archivos.jsx.map
