/* eslint-disable no-console */
import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '@/utils/constants';
import { Tema } from '@/utils/Types';
import { useState } from 'react';
import { subir } from '@/utils/gcsUtils';
// import { useSession } from 'next-auth/react';
import Boton from './Boton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload, faClose   
} from "@fortawesome/free-solid-svg-icons";


const Registro = ({
  actualizar,
  setActualizar,
  data,
  setData,
  registro,
  rutaFull,
  rutaID,
  carpetaBucket,
  tabla,
  layout,
}) => {
  const [archivo, setArchivo] = useState();
  // const { data: session } = useSession();

  const subirArchivo = async () => {
    const filename = encodeURIComponent(archivo.name);

    const { idFila, idDato } = actualizar;

    const formData = new FormData();

    formData.append('file', archivo);

    try {
      await toast.promise(
        axios.post(
          `${config.url.API_URL}/api/validar_archivo/${tabla}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        ),
        {
          pending: 'Validando archivo',
          success: 'Archivo validado',
          error: {
            render(res) {
              return res?.data?.response?.data?.error
                ? res?.data?.response?.data?.error
                : res;
            },
          },
        }
      );

      const actualizarArchivo = async () => {
        const rutaAnterior = `${carpetaBucket}/${carpetaBucket.toLowerCase()}_${
          process.env.NEXT_PUBLIC_SISTEMA
        }_${idDato}_${data[idFila].NOMBRE_ARCHIVO}`;

        await axios.delete(`${config.url.API_URL}/${rutaID}/${idDato}`, {
          data: {
            rutaArchivo: rutaAnterior,
          },
        });

        try {
          let putRes = await axios.put(
            `${config.url.API_URL}/${rutaID}/${idDato}`,
            {
              archivo: filename,
              estatus: data[idFila].ESTATUS,
              ruta: `${carpetaBucket}/${carpetaBucket.toLowerCase()}_${
                process.env.NEXT_PUBLIC_SISTEMA
              }_${idDato}_${filename}`,
              reemplazo: true,
            }
          );
          try {
            await subir(
              formData,
              `${carpetaBucket}/${carpetaBucket.toLowerCase()}_${
                process.env.NEXT_PUBLIC_SISTEMA
              }_${idDato}_${filename}`
            );
          } catch {
            putRes = await axios.put(
              `${config.url.API_URL}/${rutaID}/${actualizar.idDato}`,
              {
                archivo: data[idFila].NOMBRE_ARCHIVO,
                estatus: data[idFila].ESTATUS,
                ruta: `${carpetaBucket}/${carpetaBucket.toLowerCase()}_${
                  process.env.NEXT_PUBLIC_SISTEMA
                }_${idDato}_${data[idFila].NOMBRE_ARCHIVO}`,
                reemplazo: true,
              }
            );
            throw new Error('Error en eliminación');
          }
          setData((prev) => [
            ...prev.slice(0, idFila),
            {
              ...prev[idFila],
              ...putRes.data,
            },
            ...prev.slice(idFila + 1),
          ]);
        } catch {
          await axios.delete(`${config.url.API_URL}/${rutaID}/${idDato}`, {
            data: {
              rutaArchivo: `${carpetaBucket}/${carpetaBucket.toLowerCase()}_${
                process.env.NEXT_PUBLIC_SISTEMA
              }_${idDato}_${filename}`,
            },
          });
        }
      };

      const agregarArchivo = async () => {
        let idNuevo;
        try {
          const postRes = await axios.post(
            `${config.url.API_URL}/${rutaFull}`,
            {
              archivo: filename,
              ruta: `${carpetaBucket}/${carpetaBucket.toLowerCase()}_${
                process.env.NEXT_PUBLIC_SISTEMA
              }_${idNuevo}_${filename}`,
            }
          );
          idNuevo = postRes.data.id;
          await subir(
            formData,
            `${carpetaBucket}/${carpetaBucket.toLowerCase()}_${
              process.env.NEXT_PUBLIC_SISTEMA
            }_${idNuevo}_${filename}`
          );
          setData((prev) => [...prev, postRes.data]);
        } catch {
          await axios.delete(`${config.url.API_URL}/${rutaID}/${idNuevo}`, {
            data: {
              rutaArchivo: `${carpetaBucket}/${carpetaBucket.toLowerCase()}_${
                process.env.NEXT_PUBLIC_SISTEMA
              }_${idNuevo}_${filename}`,
            },
          });
        }
      };

      if (idFila !== undefined) {
        await toast.promise(actualizarArchivo(), {
          pending: 'Actualizando archivo',
          success: 'Archivo actualizado',
          error: {
            render(res) {
              console.log(res);
              return JSON.stringify(res, null, 2);
            },
          },
        });
      } else {
        await toast.promise(agregarArchivo(), {
          pending: 'Agregando archivo',
          success: 'Archivo agregado',
          error: {
            render(res) {
              console.log(res);
              return JSON.stringify(res, null, 2);
            },
          },
        });
      }
      setActualizar({
        activo: false,
        idDato: undefined,
        idFila: undefined,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={`${
        !actualizar.activo && 'hidden'
      } fixed top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40`}
    >
      <div className="relative flex flex-col bg-white border border-solid pointer-events-auto dark:bg-slate-850 bg-clip-padding border-black/20 rounded-xl outline-0">
        <div class="flex items-center justify-between p-4 border-b border-solid shrink-0 border-slate-100 rounded-t-xl">
          <h5 class="mb-0 leading-normal dark:text-white" >{registro}</h5>
          <button type="button" onClick={() =>
              setActualizar((prev) => ({
                ...prev,
                activo: false,
              }))
            }>
            <FontAwesomeIcon icon={faClose} className="w-4 h-4 ml-auto box-content p-2 text-black dark:text-white border-0 rounded-1.5 opacity-50 cursor-pointer -m-2"/>
          </button>
          </div>
        <div className="w-full bg-vw_dark_blue pl-4 pt-2 pb-1 text-white">
          
        </div>
          <div className="relative flex-auto p-4">
            <label htmlFor={'archivo'} className="w-1/4 bg-vw_dark_blue pl-4 pt-2 pb-1 font-light text-white">
              Archivo
            </label>
            <input
              type="file"
              className="w-full pl-4"
              name={'archivo'}
              accept=".csv" onChange={(e) => { setArchivo(e.target.files[0]); }}
            />
          </div>
          <div className="relative flex-auto p-4 flex w-full flex-col h-52 overflow-y-scroll">
            <p>Los campos que debe contener el archivo son los siguientes:</p>
            <ul>
              {layout.map((item) => {
                return <li key={item}>- {item}</li>;
              })}
            </ul>
          </div>        
        
        <div className="flex flex-wrap items-center justify-end p-3 border-t border-solid shrink-0 border-[#dee2e6] rounded-b-xl gap-10 py-2">
          <Boton
            texto="Cancelar"
            tema={Tema.blanco}
            onClick={() =>
              setActualizar((prev) => ({
                ...prev,
                activo: false,
              }))
            }
          />
          <Boton
            texto="Guardar"
            tema={Tema.azul}
            onClick={async () => {
              await subirArchivo();
              // await toast.promise(
              //   actualizar.idDato
              //     ? {
              //         pending: 'Actualizando archivo',
              //         success: 'Archivo actualizado',
              //         error: {
              //           render({ data }) {
              //             return data.response.data.erro;
              //           },
              //         },
              //       }
              //     : {
              //         pending: 'Agregando archivo',
              //         success: 'Archivo agregado',
              //         error: {
              //           render({ data }) {
              //             return data.response.data.error;
              //           },
              //         },
              //       }
              // );
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Registro;
