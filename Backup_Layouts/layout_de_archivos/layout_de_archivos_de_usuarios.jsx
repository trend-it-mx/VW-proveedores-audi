import { useEffect } from 'react';
import Boton from '@/components/Boton';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { Tema, Tipo } from '@/utils/Types';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import SelectField from '@/components/SelectField';
import Image from 'next/image';
import { toast } from 'react-toastify';

import { config } from '@/utils/constants';

import yup from '@/utils/validaciones';
import axios from 'axios';
import comprobarPermisos from '@/utils/comprobarPermisos';
import { getSession } from 'next-auth/react';

const validationSchema = yup.object().shape({
  campos: yup
    .array()
    .min(1)
    .of(
      yup.object().shape({
        nombre: yup.string().required().min(3).max(50),
        desc: yup.string().required().min(3).max(50),
        nulos: yup.string().required().oneOf(['true', 'false']),
      })
    )
    .min(1),
});

const LayoutDeUsuarios = ({ data, error }) => {
  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);
  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <div className="flex w-full flex-col items-center gap-4">
        <h1 className="w-full border-b-2 font-bold">
          Layout de archivo de usuarios
        </h1>
        <Formik
          initialValues={{ campos: data }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await toast.promise(
              axios.post(
                `${config.url.API_URL}/api/administracion/parametros/lay_archivo/?tabla=USUARIOS_VW`,
                values
              ),
              {
                pending: 'Guardando el layout',
                success: 'Layout guardado',
                error: 'No fue posibrle guardar',
              }
            );
          }}
        >
          {({ values, errors, touched }) => (
            <Form className="flex w-full flex-col pl-4 pb-8  ">
              {errors?.campos &&
                touched?.campos &&
                typeof errors.campos === typeof '' && (
                  <div className="text-red-500">
                    <ErrorMessage name={`campos`} />
                  </div>
                )}
              <div className="flex- flex-col gap-2 grid items-end md:grid-cols-5 md:gap-6">
                <div className="col-span-2 w-full">
                  <label
                    htmlFor="ambiente"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Ambiente de desarrollo:
                  </label>
                </div>
              </div>
              <div>
                <FieldArray name="campos">
                  {(arrayHelpers) => (
                    <div className="flex flex-col gap-5">
                      <div className="pb-8 border-b-2">
                        {values.campos && values.campos.length > 0 ? (
                          <div>
                            <div className="grid w-full grid-cols-5 justify-items-center gap-x-6">
                              <h2>No.</h2>
                              <h2>Nombre de campo</h2>
                              <h2>Descripción</h2>
                              <h2>Admisión de nulos</h2>
                              <h2>Eliminar campo</h2>
                            </div>
                            {values.campos.map((_, idx) => (
                              <div
                                key={idx}
                                className={`grid w-full grid-cols-5 items-center justify-items-center gap-x-6 text-sm ${
                                  idx % 2 === 0
                                    ? 'bg-gray-100/50'
                                    : 'bg-gray-200/50'
                                }`}
                              >
                                <p>{idx + 1}</p>

                                <div>
                                  <Field
                                    name={`campos.${idx}.nombre`}
                                    className="w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                  />
                                  <div className="text-red-500 flex justify-center">
                                    <ErrorMessage
                                      name={`campos.${idx}.nombre`}
                                    />
                                  </div>
                                </div>

                                <Field
                                  name={`campos.${idx}.desc`}
                                  className="w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                />

                                <Field
                                  name={`campos.${idx}.nulos`}
                                  component={SelectField}
                                  options={[
                                    {
                                      value: true,
                                      label: 'Sí',
                                    },
                                    {
                                      value: false,
                                      label: 'No',
                                    },
                                  ]}
                                />
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(idx)} // remove a friend from the list
                                >
                                  <Image
                                    alt="Bote de basura"
                                    width="20"
                                    height="20"
                                    src="/assets/images/eliminar.png"
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div>
                        <div className="flex gap-3 w-full justify-end">
                          <Boton
                            tipo={Tipo.agregar}
                            type="button"
                            texto="Agregar campo"
                            tema={Tema.blanco}
                            onClick={() => arrayHelpers.push('')}
                          />

                          <Boton
                            tipo={Tipo.guardar}
                            type="submit"
                            texto="Guardar"
                            tema={Tema.blanco}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Main>
  );
};
export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  let data = [];
  let error = false;
  try {
    const res = await axios.get(
      `${config.url.API_URL}/api/administracion/parametros/lay_archivo/?tabla=USUARIOS_VW`
    );
    data = res.data.map((campo) => ({
      nombre: campo.NOMBRE_CAMPO,
      desc: campo.DESCRIPCION,
      nulos: campo.ADMISION_NULOS,
    }));
  } catch {
    error = true;
  }
  return {
    ...comprobarPermisos(session, 'Administrador'),
    ...{
      props: {
        data,
        error,
      },
    },
  };
};

LayoutDeUsuarios.auth = true;
export default LayoutDeUsuarios;
