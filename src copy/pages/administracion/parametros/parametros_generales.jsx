import { toast } from 'react-toastify';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import axios from 'axios';
import Boton from '@/components/Boton';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { Tema, Tipo } from '@/utils/Types';
import ParametrosField from '@/components/ParametrosField';
import SelectField from '@/components/SelectField';
import { useEffect, useContext } from 'react';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession, useSession } from 'next-auth/react';
import yup from '@/utils/validaciones';
import { UserContext } from '@/components/context';

const validationSchema = yup.object().shape({
  MONEDA: yup.string().required(),
  PORC_FACTURACION: yup.number().min(0).max(100).required(),
  MONTO_MINIMO: yup.number().min(0).required(),
  DIAS_POSTERIORES_ENTREGA: yup.number().min(0).max(30).required(),
  TEMPLATE: yup.string().required(),
  SUFIJO_ORDENES_ABIERTAS: yup.number().min(100).max(999).required(),
  SUFIJO_ORDENES_CERRADAS: yup.number().min(100).max(999).required(),
  DIAS_RESPUESTA_COMPRADOR: yup.number().min(1).required(),
  DIAS_RESPUESTA_SOLICITANTE: yup.number().min(1).required(),
  INTENTOS_COMPRADOR: yup.number().min(1).required(),
  INTENTOS_SOLICITANTE: yup.number().min(1).required(),
});

const ParametrosGenerales = ({ data, opcTemplates, error }) => {
  // const { data: session } = useSession();
  const userDetails = useContext(UserContext);

  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);
  return (
    <Main>
      <div className="relative flex flex-col min-w-0 mt-6 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
      <div class="p-6 mb-0 rounded-t-2xl">
          <h5 class="dark:text-white">Configuración de parámetros generales para AUDI</h5>
      </div>        
        <Formik
          validationSchema={validationSchema}
          initialValues={data}
          onSubmit={async (values) => {
            const actualizarParametros = async () => {
              await axios.post(
                `${config.url.API_URL}/api/administracion/parametros/parametros_generales/`,
                { ...values, user_name: userDetails.user_name }
                // { ...values, user_name: session?.user?.user_name }
              );
              await axios.put(
                `${config.url.API_URL}/api/administracion/encuestas/template/${values.TEMPLATE}/`,
                { EN_USO: true }
              );
            };
            await toast.promise(actualizarParametros(), {
              pending: 'Actualizando parámetros',
              success: 'Parámetros actualizados',
              error: 'Error actualizando los parámetros',
            });
          }}
        >
          <Form className="w-full">
            <div className="flex w-full flex-col gap-5 pl-5 pr-5">
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="w-full">
                  <label
                    htmlFor="MONEDA"
                    className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80">
                    Tipo de moneda:
                  </label>
                  <Field
                    name="MONEDA"
                    component={SelectField}
                    options={[
                      { value: 'EUR', label: 'EUR' },
                      { value: 'MXN', label: 'MXN' },
                      { value: 'USD', label: 'USD' },
                      { value: 'GBP', label: 'GBP' },
                      { value: 'JPY', label: 'JPY' },
                      { value: 'CHF', label: 'CHF' },
                    ]}
                    className="border-gray-500"
                  />
                  <div className="text-red-500">
                    <ErrorMessage name={`MONEDA`} />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <ParametrosField
                  name="MONTO_MINIMO"
                  label="Monto mínimo para generación de encuestas"
                  type="number"
                />

                <ParametrosField
                  name="PORC_FACTURACION"
                  label="Porcentaje de facturación"
                  type="number"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="TEMPLATE"
                  className="mb-2 block text-sm font-medium text-gray-900 "
                >
                  Template de encuesta:
                </label>

                <Field
                  name="TEMPLATE"
                  component={SelectField}
                  options={opcTemplates}
                />
                <div className="text-red-500">
                  <ErrorMessage name={`TEMPLATE`} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <ParametrosField
                  name="SUFIJO_ORDENES_ABIERTAS"
                  label="Prefijo en número de órdenes abiertas"
                  type="number"
                  required
                />

                <ParametrosField
                  name="SUFIJO_ORDENES_CERRADAS"
                  label="Prefijo en número de órdenes cerradas"
                  type="number"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <ParametrosField
                  name="DIAS_RESPUESTA_COMPRADOR"
                  label="Días permitidos para responder encuesta; Comprador"
                  type="number"
                  required
                />

                <ParametrosField
                  name="DIAS_RESPUESTA_SOLICITANTE"
                  label="Días permitidos para responder encuesta; Solicitante"
                  type="number"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <ParametrosField
                  name="INTENTOS_COMPRADOR"
                  label="Intentos permitidos; Comprador"
                  type="number"
                  required
                />

                <ParametrosField
                  name="INTENTOS_SOLICITANTE"
                  label="Intentos permitidos; Solicitante"
                  type="number"
                  required
                />
              </div>
            </div>
            <div className="flex w-full justify-end pr-4 gap-5 ">
              <Boton
                tipo={Tipo.guardar}
                texto="Guardar"
                tema={Tema.blanco}
                submit
              />
            </div>
          </Form>
        </Formik>
      </div>
    </Main>
  );
};
export const getServerSideProps = async () => {
  // export const getServerSideProps = async (ctx) => {
  // const session = await getSession(ctx);

  let error = false;
  let data = [];
  let opcTemplates = [];

  try {
    const res = await fetch(
      `${config.url.API_URL}/api/administracion/parametros/parametros_generales/`
    );

    data = await res.json();

    const templatesRes = await fetch(
      `${config.url.API_URL}/api/administracion/encuestas/templates/`
    );

    opcTemplates = await templatesRes.json();

    opcTemplates = opcTemplates
      .filter((tmpe) => tmpe.ESTATUS === 'Activa')
      .map((template) => ({
        value: template.ID_TEMPLATE,
        label: template.NOMBRE_TEMPLATE,
      }));
  } catch {
    error = true;
  }
  return {
    // ...comprobarPermisos(session, 'Administrador'),
    ...{
      props: {
        data,
        opcTemplates,
        error,
      },
    },
  };
};

ParametrosGenerales.auth = true;
ParametrosGenerales.roles = ['Administrador'];
export default ParametrosGenerales;
