import { CSVLink } from 'react-csv';

const BotonesLayout = ({ data, headers, nombrefile, textobtn }) => {
  return (
    <CSVLink
      className={`rounded-xl border-2 border-blue-300 py-2 px-4 text-center shadow-lg hover:bg-blue-300`}
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
