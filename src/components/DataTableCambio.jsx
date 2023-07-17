import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp, faSortDown, faChevronRight,  faChevronLeft, faAnglesLeft, faAnglesRight, faPenToSquare , faSearch
} from "@fortawesome/free-solid-svg-icons";

function DataTable({ rows }) {
  const [sorting, setSorting] = useState([]);
  const [tableData, setTableData] = useState(rows);
  useEffect(() => {
    setTableData(rows);
  }, [rows]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'fecha',
        header: () => 'Fecha',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'tipo_de_cambio',
        header: () => 'Tipo de cambio',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'indicador',
        header: () => 'Indicador',
        footer: (props) => props.column.id,
      },
    ],
    []
  );
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });
  return (
      <div className="relative flex flex-col w-full min-w-0 mb-0 break-words bg-white border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
        <div className="flex-auto px-0 pt-0 pb-2">
          <div className="p-0 overflow-x-auto">
          <div className="table-responsive">
            <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
              <thead className="align-bottom">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}> {headerGroup.headers.map((header, idx) => {
                      return (
                        <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70" key={header.id}  >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? 'cursor-pointer select-none'
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{ asc: <> <FontAwesomeIcon icon={faSortUp} className="text-sm  text-black"/> </> 
                              ,desc: <> <FontAwesomeIcon icon={faSortDown} className="text-sm  text-black"/> </> , }
                              [header.column.getIsSorted()] ?? null}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody >
              
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell, idx) => {
                        return (
                          <td key={cell.id} className="p-2 align-middle bg-transparent border-b whitespace-nowrap text-base bg-transparent text-sm shadow-transparent">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
          </div>
        </div>
      </div>
    </div>
  );
}
export default DataTable;
// # sourceMappingURL=DataTableCambio.jsx.map
