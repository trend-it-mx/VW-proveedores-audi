import { CSVLink } from 'react-csv';

const BotonesLayout = ({ data, headers, nombrefile, textobtn }) => {
  return (
    <CSVLink
      className={`rounded-xl border-2 border-black py-2 px-4 text-center shadow-lg hover:bg-black`}
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
