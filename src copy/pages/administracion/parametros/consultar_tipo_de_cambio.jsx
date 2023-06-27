import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import DataTable from '@/components/DataTableCambio';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import BotonCSV from '@/components/BotonCSV';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const headers = [
  { label: 'Fecha', key: 'fecha' },
  { label: 'Tipo de Cambio', key: 'tipo_de_cambio' },
  { label: 'Indicador', key: 'indicador' },
];
const formatoMexico = Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 });

const ConsultarTipoDeCambio = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([
    {
      fecha: '',
      tipo_de_cambio: '',
      indicador: '',
      subRows: undefined,
    },
  ]);
  const onChange = async (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start !== null && end !== null) {
      const inicio = `${start.getFullYear()}-${
        start.getMonth() + 1
      }-${start.getDate()}`;
      const final = `${end.getFullYear()}-${
        end.getMonth() + 1
      }-${end.getDate()}`;
      const res = await axios.get(
        `${config.url.API_URL}/api/tipos_cambio/?inicio=${inicio}&final=${final}`
      );
      setData(
        res.data.map((reg) => ({
          fecha: reg.FECHA.value,
          tipo_de_cambio: reg.TIPO_DE_CAMBIO
            ? formatoMexico.format(reg.TIPO_DE_CAMBIO)
            : '-',
          indicador: reg.INDICADOR,
          subRows: undefined,
        }))
      );
    }
  };

  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>

      <div className="relative flex flex-col flex-auto min-w-0 p-4 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border mx-auto w-2/3" id="descargar">
        <div className="flex items-center justify-between">
          <div className="mb-5 flex w-3/5 items-center gap-2">
            <h5 className="b-0 pl-10">Cambiar fecha:</h5>
            <DatePicker
              className="w-64 border-2 border-black text-center"
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              selectsRange
              showDisabledMonthNavigation
            />
          </div>
          {data.length > 1 && (
            <BotonCSV
              data={data}
              headers={headers}
              nombrefile="ConsultarTipoDeCambio.csv"
              textobtn="Descargar"
            ></BotonCSV>
          )}
        </div>

        <DataTable rows={data} setData={setData} />
      </div>
    </Main>
  );
};

ConsultarTipoDeCambio.auth = true;
ConsultarTipoDeCambio.roles = ['Administrador'];

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   return comprobarPermisos(session, 'Administrador');
// };
export default ConsultarTipoDeCambio;
// # sourceMappingURL=consultar_tipo_de_cambio.jsx.map
