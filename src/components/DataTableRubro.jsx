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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp, faSortDown, faChevronRight,  faChevronLeft, faAnglesLeft, faAnglesRight, faPenToSquare , faSearch
} from "@fortawesome/free-solid-svg-icons";


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
        header: () => '',
        cell: ({ row }) => {
          return (
            <button
            {...{
              onClick: () => {
                editarRubro(row.index, row.original);
              },
            }} className="cursor-pointer" >
            {
              <div className="min-h-6 mb-0.5 flex items-center">
                <input checked={row.original.estatus === 'Activo' ? 'true' : '' } className="rounded-10 duration-300 ease-in-out after:rounded-circle after:shadow-2xl after:duration-300 checked:after:translate-x-5.3 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-black/95 checked:bg-stone-500/95 checked:bg-none checked:bg-right" type="checkbox" /> 
              </div>
            }
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
              } className="cursor-pointer">
              <FontAwesomeIcon icon={faPenToSquare} className="min-h-6"/>
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
    <div className="relative flex flex-col w-full min-w-0 mb-0 break-words bg-white border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
      <div className="flex-auto px-0 pt-0 pb-2">
        <div className="p-0 overflow-x-auto">
          <div className="flex items-center gap-6 w-full max-w-full px-3 mx-auto mt-4 ">
            <div className="relative flex flex-wrap items-stretch  transition-all rounded-lg ease gap-6">
              <span className="text-sm ease leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
                <FontAwesomeIcon icon={faSearch}/>
              </span>                              
              <input
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 text-sm focus:shadow-primary-outline ease w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:transition-shadow"
                placeholder={'Buscar'}
              />
            </div>
          </div>
        <div className="table-responsive">
          <table className="flex w-full flex-col gap-3">
            <thead className="align-bottom">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}> {headerGroup.headers.map((header, idx) => {
                    return (
                      <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70" key={header.id} colSpan={header.colSpan} >
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
            <tbody className="flex w-full flex-col gap-3">
            
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className="grid grid-cols-12 items-center justify-items-start pl-4 text-base bg-transparent border-b text-sm shadow-transparent">
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
        </div>        
        {/* Inicio de paginación */}
        <div className="flex justify-right px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
          <button
            onClick={() => table.setPageIndex(0)} clasName="inline-block px-2 py-1 mr-1 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-black to-stone-500 leading-normal text-xs ease-in tracking-tight-rem shadow-xs  bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md"
            disabled={!table.getCanPreviousPage()} >
            <FontAwesomeIcon icon={faAnglesLeft} className="p-2"/>
          </button>
          <button            
            clasName="inline-block px-2 py-1 mr-1 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-black to-stone-500 leading-normal text-xs ease-in tracking-tight-rem shadow-xs  bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <FontAwesomeIcon icon={faChevronLeft} className="p-2"/>
          </button>
          <button
            clasName="inline-block px-2 py-1 mr-1 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-black to-stone-500 leading-normal text-xs ease-in tracking-tight-rem shadow-xs  bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <FontAwesomeIcon icon={faChevronRight} className="p-2"/>
          </button>
          <button
            clasName="inline-block px-2 py-1 mr-1 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-black to-stone-500 leading-normal text-xs ease-in tracking-tight-rem shadow-xs  bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}>
            <FontAwesomeIcon icon={ faAnglesRight} className="p-2"/>
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
    </div>
  </div>
  );
}
export default DataTable;
