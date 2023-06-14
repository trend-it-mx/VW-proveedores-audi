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

const Registro = ({ actualizar, setActualizar, data, setData }) => {
  const userDetails = useContext(UserContext);
  // const { data: session } = useSession();
  return (
    <div
      className={`${
        !actualizar.activo && 'hidden'
      } fixed top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40`}
    >
      <div className="flex w-2/3 flex-col divide-y-2 bg-white">
        <div className="w-full bg-vw_dark_blue pl-4 pt-2 pb-1 text-white">
          Registro de pregunta
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
                <div className="flex">
                  <label
                    htmlFor={'pregunta'}
                    className="w-1/4 bg-vw_dark_blue pl-4 pt-2 pb-1 font-light text-white"
                  >
                    Pregunta:
                  </label>
                  <Field type="text" className="w-full pl-4" name="pregunta" />
                </div>
                {formik.errors.pregunta && formik.touched.pregunta && (
                  <div className="flex gap-1 text-red-500 font-bold pl-5">
                    <p>Pregunta: </p>
                    <ErrorMessage name="pregunta" />
                  </div>
                )}
                <div className="flex w-full items-center justify-center gap-10 py-2">
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
