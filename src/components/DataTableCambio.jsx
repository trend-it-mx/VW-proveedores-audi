import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

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
    <table className="flex w-full flex-col gap-3">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="grid grid-cols-12 justify-items-center border-2 border-black bg-vw_dark_blue py-2 pl-4 text-base font-light text-white"
          >
            {headerGroup.headers.map((header) => {
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={'col-span-4'}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody className="flex w-full flex-col gap-3">
        {table.getRowModel().rows.map((row) => {
          return (
            <tr
              key={row.id}
              className="grid grid-cols-12 items-center justify-items-center border-2 border-black pl-4 text-base text-black"
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id} className={'col-span-4 '}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default DataTable;
// # sourceMappingURL=DataTableCambio.jsx.map
