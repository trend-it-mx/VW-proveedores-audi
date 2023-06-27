import Boton from '@/components/Boton';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { Tema } from '@/utils/Types';
import { toast } from 'react-toastify';
import { React, useState } from 'react';
import { subir } from '@/utils/gcsUtils';
import Select from 'react-select';

// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';
import axios from 'axios';
import { config } from '@/utils/constants';
import Papa from 'papaparse';
import Swal from 'sweetalert2';

const opcAnios = [
  {
    value: 2020,
    label: '2020',
  },
  {
    value: 2021,
    label: '2021',
  },
  {
    value: 2022,
    label: '2022',
  },
  {
    value: 2023,
    label: '2023',
  },
  {
    value: 2024,
    label: '2024',
  },
  {
    value: 2025,
    label: '2025',
  },
];

const validarArchivo = (filas, anio) => {
  const columnas = Object.keys(filas[0]);

  if (columnas.length !== 3) {
    toast.error('No se tiene el número de columnas esperado (3).');
    return false;
  }

  if (
    columnas[0] !== 'MES' ||
    columnas[1] !== 'DIA' ||
    columnas[2] !== 'HABIL'
  ) {
    toast.error(
      `Las columnas no tienen los nombres esperados (MES, DIA, HABIL).`
    );
    return false;
  }

  const filasDias = filas.slice(0).filter((fila) => fila.MES !== '');

  const largo = filasDias.length;

  const isLeap = new Date(anio, 1, 29).getMonth() === 1;
  if ((isLeap && largo !== 366) || (!isLeap && largo !== 365)) {
    toast.error(
      `El archivo no tiene el número de días esperado (${
        isLeap ? '366' : '365'
      }).`
    );
    return false;
  }

  const meses = filasDias.map((fila) => Number(fila.MES));

  if (meses.find((mes) => mes < 1 || mes > 12) !== undefined) {
    toast.error('Los meses no tienen los valores esperados (entre 1 y 12).');
    return false;
  }

  const dias = filasDias.map((fila) => Number(fila.DIA));

  if (dias.find((dia) => dia < 1 || dia > 31) !== undefined) {
    toast.error('Los días no tienen los valores esperados (entre 1 y 31).');
    return false;
  }

  const habiles = filasDias.map((fila) => fila.HABIL);

  if (habiles.find((habil) => habil !== 'NO' && habil !== 'SI') !== undefined) {
    toast.error('La columna HABIL no tiene los valores esperados (NO / SI).');
    return false;
  }

  return true;
};

const CargarCalendario = ({ data }) => {
  const [archivo, setArchivo] = useState();
  const [anio, setAnio] = useState();

  const subirArchivo = async () => {
    const dividido = archivo.name.split('.');
    const extension = dividido[dividido.length - 1];
    if (extension !== 'csv') {
      toast.error('El archivo no es un csv.');
      return;
    }
    const sistema = process.env.NEXT_PUBLIC_SISTEMA;

    const filename = encodeURIComponent(
      `calendario_${sistema.toLowerCase()}_${anio}.csv`
    );
    const rutaArchivo = `Calendarios/${filename}`;
    const formData = new FormData();

    const reader = new FileReader();
    formData.append('file', archivo);

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      if (!parsedData) {
        toast.error('El archivo no es un csv.');
        return;
      }
      if (validarArchivo(parsedData, anio)) {
        try {
          await toast.promise(subir(formData, rutaArchivo), {
            pending: 'Agregando calendario',
            success: 'Calendario agregado',
            error: 'Error agregando el calendario',
          });
        } catch (e) {
          console.log(e);
        }
      }
    };

    reader.readAsText(archivo);
  };

  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>

        <div class="relative flex flex-col ">
          <div class="table-responsive">
              <div className="w-full mx-auto p-2">
                <div className="relative flex flex-col flex-auto min-w-0 p-4  overflow-hidden break-words bg-white border-0 shadow-3xl dark:bg-slate-850 rounded-2xl bg-clip-border">
                  <div className="flex flex-wrap -mx-3">
                    <div className="flex-none w-auto max-w-full px-3 my-auto">
                      <div className="h-full">
                        <h5 className="mb-1 dark:text-white">Carga de calendario</h5>
                      </div>
                    </div>                                                    
                      <form className="flex w-full flex-col gap-5 pl-4">
                        <div className="grid md:grid-cols-1 md:gap-6">
                          <div className=" max-w-full px-3 flex-0">
                            <label htmlFor="ambiente" className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80" >Año a cargar:
                            </label>
                            <div class="relative flex flex-wrap items-stretch w-full rounded-lg">
                              <Select
                                instanceId="anio"
                                id="anio"
                                className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none"
                                options={opcAnios}
                                value={opcAnios.find((opc) => opc.value === anio)}
                                onChange={(e) => setAnio(e.value)}
                              />
                            </div>
                          </div>
                          <div className=" max-w-full px-3 flex-0">
                            <label htmlFor="ambiente" className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80" >
                              Archivo a cargar:
                            </label>
                            <div class="relative flex flex-wrap items-stretch w-full rounded-lg">
                              <input
                                type="file"
                                name={`Calendario`}
                                className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none"
                                accept=".csv,text/csv"
                                onChange={(e) => {
                                  setArchivo(e.target.files[0]);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </form>

                      <div className="w-full p-4">
                        <p className=" w-full text-center">
                          El archivo csv debe contener los siguientes campos y valores:
                        </p>
                        <ul className="list-disc pl-10">
                          <li>MES: Número entero entre 1-12</li>
                          <li>DIA: Número entero entre 1-31</li>
                          <li>HABIL: Texto entre NO/SI</li>
                        </ul>
                      </div>

                      <div className="flex w-full justify-end pr-4">
                        <Boton
                          texto="Cargar"
                          tema={Tema.blanco}
                          onClick={async () => {
                            if (!archivo || !anio) {
                              toast.error('Debes llenar todos los campos antes de enviar');
                              return;
                            }
                            if (data.find((fecha) => fecha.ANIO === anio)) {
                              Swal.fire({
                                title: 'Año cargado. ¿Desea recargarlo?',
                                showCancelButton: true,
                                confirmButtonText: 'Sí',
                                confirmButtonColor: 'rgb(0,30,80)',
                                cancelButtonText: 'No',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  subirArchivo();
                                }
                              });
                            } else {
                              subirArchivo();
                            }
                          }}
                        />
                      </div>                  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          

    </Main>
  );
};

CargarCalendario.auth = true;
CargarCalendario.roles = ['Administrador'];

// export const getServerSideProps = async (ctx) => {
export const getServerSideProps = async () => {
  // const session = await getSession(ctx);
  let data = [];
  let error = false;
  try {
    const res = await axios.get(
      `${config.url.API_URL}/api/administracion/calendario/`
    );
    data = res.data;
  } catch {
    error = true;
  }
  return {
    // ...comprobarPermisos(session, 'Administrador'),
    ...{
      props: {
        data,
        error,
      },
    },
  };
};
export default CargarCalendario;
// # sourceMappingURL=cargar_calendario.jsx.map
