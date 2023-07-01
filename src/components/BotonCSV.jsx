import { CSVLink } from 'react-csv';

const BotonesLayout = ({ data, headers, nombrefile, textobtn }) => {
  return (
    <CSVLink
      className={`inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-black to-zinc-600 leading-normal text-xs ease-in tracking-tight-rem shadow-xs bg-150 bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md `}
      data={data}
      headers={headers}
      filename={nombrefile}
      separator={','}
    >
      {textobtn}
    </CSVLink>
  );
};
export default BotonesLayout;
