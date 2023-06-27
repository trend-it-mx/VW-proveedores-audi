import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import fuzzyFilter from '@/utils/fuzzyFilter';

function DataTable({ rows }) {
  const [sorting, setSorting] = useState([]);
  const [tableData, setTableData] = useState(rows);
  const [globalFilter, setGlobalFilter] = useState('');
  useEffect(() => {
    setTableData(rows);
  }, [rows]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'purchase_order',
        header: () => 'Orden de compra',
        filterFn: 'fuzzy',
      },
      {
        accessorKey: 'nombre_de_proveedor',
        header: () => 'Nombre de proveedor',
        filterFn: 'fuzzy',
      },
      {
        accessorKey: 'total',
        header: () => 'Total',
        filterFn: 'fuzzy',
      },
      {
        accessorKey: 'moneda',
        header: () => 'Moneda',
        filterFn: 'fuzzy',
      },
    ],
    []
  );
  const table = useReactTable({
    data: tableData,
    columns,

    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-6">
        <h2 className="text-xl text-gray-600">Buscar: </h2>
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-1 font-lg border-2 shadow rounded border-block border-vw_dark_blue"
          placeholder={'...'}
        />
      </div>
      <table className="flex w-full flex-col gap-3">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="grid grid-cols-12 justify-items-start border-2 border-black bg-vw_dark_blue py-2 pl-4 text-base font-light text-white"
            >
              {headerGroup.headers.map((header, idx) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={idx === 1 ? 'col-span-6' : 'col-span-2'}
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
                className="grid grid-cols-12 items-center justify-items-start border-2 border-black pl-4 text-base text-black"
              >
                {row.getVisibleCells().map((cell, idx) => {
                  return (
                    <td
                      key={cell.id}
                      className={idx === 1 ? 'col-span-6' : 'col-span-2'}
                    >
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
      {/* Inicio de paginación */}
      <div className="flex justify-center">
        <button
          onClick={() => table.setPageIndex(0)}
          className="border border-vw_dark_blue bg-vw_dark_blue hover:scale-95 hover:bg-white ease-out rounded-lg overflow-hidden
          relative transition-all duration-75 hover:border-vw_dark_blue hover:text-vw_dark_blue hover:font-bold text-white font-bold py-2 px-4
          hover:after:w-full after:absolute after:h-full after:transition-all after:w-0 after:top-0 after:left-0 after:z-1 mr-1"
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border border-vw_dark_blue bg-vw_dark_blue hover:scale-95 hover:bg-white ease-out rounded-lg overflow-hidden
          relative transition-all duration-75 hover:border-vw_dark_blue hover:text-vw_dark_blue hover:font-bold text-white font-bold py-2 px-4
          hover:after:w-full after:absolute after:h-full after:transition-all after:w-0 after:top-0 after:left-0 after:z-1 mr-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border border-vw_dark_blue bg-vw_dark_blue hover:scale-95 hover:bg-white ease-out rounded-lg overflow-hidden
          relative transition-all duration-75 hover:border-vw_dark_blue hover:text-vw_dark_blue hover:font-bold text-white font-bold py-2 px-4
          hover:after:w-full after:absolute after:h-full after:transition-all after:w-0 after:top-0 after:left-0 after:z-1 mr-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border border-vw_dark_blue bg-vw_dark_blue hover:scale-95 hover:bg-white ease-out rounded-lg overflow-hidden
          relative transition-all duration-75 hover:border-vw_dark_blue hover:text-vw_dark_blue hover:font-bold text-white font-bold px-2
          hover:after:w-full after:absolute after:h-full after:transition-all after:w-0 after:top-0 after:left-0 after:z-1 mr-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1 pr-1">
          <div>Página</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Ir a la página:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border-2 border-vw_dark_blue p-1 rounded w-16"
          />
        </span>
      </div>
      {/* Fin de paginación */}
    </div>
  );
}
export default DataTable;
// # sourceMappingURL=DataTablePregunta.jsx.map
