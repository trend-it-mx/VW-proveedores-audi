import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '@/utils/constants';

const limpieza = () => {
  toast.promise(
    axios.get(`${config.url.API_URL}/api/transformacion/limpiar/`),
    {
      success: 'Ambiente limpiado exitosamente',
      pending: 'Limpiando ambiente',
      error: 'Ha ocurrido un error',
    }
  );
};

const ejecutar = () => {
  toast.promise(
    axios.get(`${config.url.API_URL}/api/transformacion/ejecutar/`),
    {
      success: 'Transformaciones ejecutadas exitosamente',
      pending: 'Ejecutando transformaciones',
      error: 'Ha ocurrido un error',
    }
  );
};

const ControlDeFlujo = () => {
  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <h1 className="mb-6 font-bold">Seleccione una opción:</h1>
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 pl-4">
        <button
          onClick={limpieza}
          className="rounded-xl border-2 border-blue-300 py-2 text-center shadow-lg hover:bg-blue-300"
        >
          Limpiar datos del ambiente
        </button>

        <button
          onClick={ejecutar}
          className="rounded-xl border-2 border-blue-300 py-2 text-center shadow-lg hover:bg-blue-300"
        >
          Ejecutar transformaciones
        </button>
      </div>
    </Main>
  );
};
export default ControlDeFlujo;

ControlDeFlujo.roles = ['Key user', 'Administrador'];
