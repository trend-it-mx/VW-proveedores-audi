import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { config } from '@/utils/constants';
import { Tema } from '@/utils/Types';
import yup from '@/utils/validaciones';
// import { useSession } from 'next-auth/react';
import { UserContext } from '@/components/context';
import { useContext } from 'react';
import Boton from './Boton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload, faClose   
} from "@fortawesome/free-solid-svg-icons";

const Registro = ({ actualizar, setActualizar, data, setData }) => {
  const userDetails = useContext(UserContext);
  // const { data: session } = useSession();
  return (
    <div
      className={`${
        !actualizar.activo && 'hidden'
      } fixed top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40`}
    >
      <div className="relative flex flex-col bg-white border border-solid pointer-events-auto dark:bg-slate-850 bg-clip-padding border-black/20 rounded-xl outline-0">        
        <div class="flex items-center justify-between p-4 border-b border-solid shrink-0 border-slate-100 rounded-t-xl">
          <h5 class="mb-0 leading-normal dark:text-white" >Registro de pregunta</h5>
        </div>
        <div className="w-full bg-vw_dark_blue pl-4 pt-2 pb-1 text-white">          
        </div>
        <Formik
          initialValues={{
            pregunta: data[actualizar.idFila]?.pregunta || '',
          }}
          enableReinitialize
          validationSchema={yup.object().shape({
            pregunta: yup.string().required().min(5).max(500),
          })}
          onSubmit={async (values, { resetForm }) => {
            const { idFila } = actualizar;
            if (idFila !== undefined) {
              const res = await toast.promise(
                axios.put(
                  `${config.url.API_URL}/api/administracion/encuestas/pregunta/${actualizar.idDato}`,
                  {
                    pregunta: values.pregunta,
                    estatus: data[actualizar.idFila].estatus,
                    // user_name: session.user.user_name,
                    user_name: userDetails.user_name,
                  }
                ),
                {
                  pending: 'Actualizando pregunta',
                  success: 'Pregunta actualizada',
                  error: 'Error actualizando la pregunta',
                }
              );

              setData((prev) => [
                ...prev.slice(0, idFila),
                {
                  ...prev[idFila],
                  ...res.data,
                },
                ...prev.slice(idFila + 1),
              ]);
            } else {
              const res = await toast.promise(
                axios.post(
                  `${config.url.API_URL}/api/administracion/encuestas/preguntas`,
                  {
                    pregunta: values.pregunta,
                    // user_name: session.user.user_name,
                    user_name: userDetails.user_name,
                  }
                ),
                {
                  pending: 'Agregando pregunta',
                  success: 'Pregunta agregada',
                  error: 'Error agregando la pregunta',
                }
              );
              setData((prev) => [...prev, res.data]);
            }
            setActualizar({
              activo: false,
              idDato: undefined,
              idFila: undefined,
            });

            resetForm();
          }}
        >
          {(formik) => {
            return (
              <Form className="flex flex-col gap-2">
                <div className="px-3 flex-0">
                  <label htmlFor={'pregunta'} className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80">
                    Pregunta:
                  </label>
                  <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
                      <Field type="text" className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none" name="pregunta" />
                  </div>                  
                </div>
                {formik.errors.pregunta && formik.touched.pregunta && (
                  <div className="flex gap-1 text-red-500 font-bold pl-5">
                    <p>Pregunta: </p>
                    <ErrorMessage name="pregunta" />
                  </div>
                )}
                <div className="flex w-full items-center justify-center gap-10 py-2 pl-12 pr-12">
                  <Boton
                    texto="Cancelar"
                    type="reset"
                    tema={Tema.blanco}
                    onClick={() => {
                      formik.resetForm();
                      setActualizar({
                        activo: false,
                        idDato: undefined,
                        idFila: undefined,
                      });
                    }}
                  />
                  <Boton texto="Guardar" type="submit" tema={Tema.azul} />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
export default Registro;
