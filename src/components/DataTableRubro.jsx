import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import Image from 'next/image';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { config } from '@/utils/constants';
import fuzzyFilter from '@/utils/fuzzyFilter';

const colSpan = (idx) => {
  if (idx === 0) {
    return 'col-span-10';
  }
  return 'col-span-1';
};
function DataTable({ rows, setActualizar, setData }) {
  const [sorting, setSorting] = useState([]);
  const [tableData, setTableData] = useState(rows);
  const [globalFilter, setGlobalFilter] = useState('');
  useEffect(() => {
    setTableData(rows);
  }, [rows]);

  const columns = useMemo(() => {
    const editarRubro = async (index, rubro) => {
      if (rubro.en_uso === 'SI') {
        toast.error('No se pueden inhabilitar rubros en uso por templates.');
        return;
      }

      const res = await toast.promise(
        axios.put(
          `${config.url.API_URL}/api/administracion/encuestas/rubro/${rubro.id}`,
          {
            rubro: rubro.rubro,
            estatus: rubro.estatus === 'Activo' ? 'Inactivo' : 'Activo',
          }
        ),
        {
          pending: 'Actualizando rubro',
          success: 'Rubro actualizado',
          error: 'Error actualizando la rubro',
        }
      );
      setData((prev) => {
        const copia = [...prev];
        copia[index] = res.data;
        return copia;
      });
    };
    return [
      {
        accessorKey: 'rubro',
        header: () => 'Rubro',
        footer: (props) => props.column.id,
        filterFn: 'fuzzy',
      },
      {
        id: 'estatus',
        header: () => 'Estatus',
        cell: ({ row }) => {
          return (
            <button
              {...{
                onClick: () => {
                  editarRubro(row.index, row.original);
                },
              }}
              className="cursor-pointer"
            >
              <Image
                src={`/assets/images/${
                  row.original.estatus === 'Activo' ? 'activado' : 'desactivado'
                }.png`}
                alt="Lápiz escribiendo"
                width="40"
                height="20"
              />
            </button>
          );
        },
      },
      {
        id: 'editar',
        header: () => null,
        cell: ({ row }) => {
          return (
            <button
              onClick={() =>
                setActualizar({
                  activo: true,
                  idDato: row.original.id,
                  idFila: row.index,
                })
              }
              className="cursor-pointer pt-1"
            >
              <Image
                src="/assets/images/editar.png"
                alt="Lápiz escribiendo"
                width="30"
                height="30"
              />
            </button>
          );
        },
      },
    ];
  }, [setActualizar, setData]);
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
                    className={idx === 0 ? 'col-span-10' : 'col-span-1'}
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
                    <td key={cell.id} className={colSpan(idx)}>
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
