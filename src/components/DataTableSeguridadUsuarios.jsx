import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { config } from '@/utils/constants';
import Swal from 'sweetalert2';
import fuzzyFilter from '@/utils/fuzzyFilter';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp, faSortDown, faChevronRight,  faChevronLeft, faAnglesLeft, faAnglesRight, faPenToSquare , faSearch
} from "@fortawesome/free-solid-svg-icons";
function DataTable({ rows, setActualizar, setData }) {
  const colSpan = (id) => {
    switch (id) {
      case 2:
      case 1:
        return 3;
      case 0:
      case 3:
        return 2;
      default:
        return 1;
    }
  };
  const [sorting, setSorting] = useState([]);
  const [tableData, setTableData] = useState(rows);
  const [globalFilter, setGlobalFilter] = useState('');
  useEffect(() => {
    setTableData(rows);
  }, [rows]);
  const rerender = useReducer(() => ({}), {})[1];
  const columns = useMemo(() => {
    const editarPregunta = async (index, usuario) => {
      if (usuario.estatus === 'Activo') {
        const resEncuestas = await axios.get(
          `${config.url.API_URL}/api/usuarios/encuestas`
        );
        const encuestasGeneradas = resEncuestas.data.filter(
          (enc) => enc.ESTATUS === 'GENERADA'
        );
        if (encuestasGeneradas.length > 0) {
          Swal.fire({
            title: '¿Desea archivar al usuario?',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            confirmButtonColor: 'rgb(0,30,80)',
            cancelButtonText: 'Cancelar',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const res = await toast.promise(
                axios.put(
                  `${config.url.API_URL}/api/seguridad/usuario/${usuario.usuario}`,
                  {
                    rol: usuario.rol,
                    estatus:
                      usuario.estatus === 'Activo' ? 'Inactivo' : 'Activo',
                  }
                ),
                {
                  pending: 'Actualizando usuario',
                  success: 'Usuario actualizado',
                  error: 'Error actualizando la usuario',
                }
              );
              setData((prev) => {
                const copia = [...prev];
                copia[index] = {
                  ...copia[index],
                  rol: res.data.rol,
                  estatus: res.data.estatus,
                };
                return copia;
              });
            }
          });
        } else {
          const res = await toast.promise(
            axios.put(
              `${config.url.API_URL}/api/seguridad/usuario/${usuario.usuario}`,
              {
                rol: usuario.rol,
                estatus: usuario.estatus === 'Activo' ? 'Inactivo' : 'Activo',
              }
            ),
            {
              pending: 'Actualizando usuario',
              success: 'Usuario actualizado',
              error: 'Error actualizando la usuario',
            }
          );
          setData((prev) => {
            const copia = [...prev];
            copia[index] = {
              ...copia[index],
              rol: res.data.rol,
              estatus: res.data.estatus,
            };
            return copia;
          });
        }
      } else {
        const res = await toast.promise(
          axios.put(
            `${config.url.API_URL}/api/seguridad/usuario/${usuario.usuario}`,
            {
              rol: usuario.rol,
              estatus: usuario.estatus === 'Activo' ? 'Inactivo' : 'Activo',
            }
          ),
          {
            pending: 'Actualizando usuario',
            success: 'Usuario actualizado',
            error: 'Error actualizando la usuario',
          }
        );
        setData((prev) => {
          const copia = [...prev];
          copia[index] = {
            ...copia[index],
            rol: res.data.rol,
            estatus: res.data.estatus,
          };
          return copia;
        });
      }
    };
    return [
      {
        accessorKey: 'usuario',
        header: () => 'Usuario',
        filterFn: 'fuzzy',
      },
      {
        accessorKey: 'nombre',
        header: () => 'Nombre completo',
        filterFn: 'fuzzy',
      },
      {
        accessorKey: 'correo_electronico',
        header: () => 'Correo electrónico',
        filterFn: 'fuzzy',
      },
      {
        accessorKey: 'roles',
        header: () => 'Roles',
        cell: (roles) => {
          return (
            <div className="flex flex-col">
              {roles.getValue().map((rol) => (
                <span key={rol}>{rol}</span>
              ))}
            </div>
          );
        },
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
                editarPregunta(row.index, row.original);
              },
            }} className="cursor-pointer" >
            {
              <div className="min-h-6 mb-0.5 flex items-center">
                <p>{row.original.estatus }</p>
                <input checked={row.original.estatus === 'Activo' ? 'true' : 'false' } className="rounded-10 duration-300 ease-in-out after:rounded-circle after:shadow-2xl after:duration-300 checked:after:translate-x-5.3 h-5 mt-0.5 relative float-left w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-black/95 checked:bg-stone-500/95 checked:bg-none checked:bg-right" type="checkbox" /> 
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
                setActualizar((prev) => {
                  const datoCorrespondiente = {
                    ...tableData[row.index],
                  };
                  delete datoCorrespondiente.subRows;
                  rerender();
                  return {
                    ...prev,
                    activo: true,
                    dato: datoCorrespondiente,
                    idx: row.index,
                  };
                })
              }
              className="cursor-pointer">
              <FontAwesomeIcon icon={faPenToSquare} className="min-h-6"/>
            </button>
          );
        },
      },
    ];
  }, [rerender, setActualizar, setData, tableData]);
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
        <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
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
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="text-sm font-normal leading-normal" >
                  {row.getVisibleCells().map((cell, idx) => {
                    return (
                      <td
                        key={cell.id}
                        // className={
                        //   idx === 0 || idx === 1 ? 'col-span-5' : 'col-span-1'
                        // }
                        className="p-2 leading-normal align-middle bg-transparent border-b text-sm whitespace-nowrap shadow-transparent">
                        {flexRender(cell.column.columnDef.cell, cell.getContext() )}
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
