/* eslint-disable no-template-curly-in-string */
import { useState, useEffect, useMemo, useContext } from 'react';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import Select from 'react-select';
import Boton from '@/components/Boton';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import { Tema, Tipo } from '@/utils/Types';
import SelectField from '@/components/SelectField';
import PuntosRubroField from '@/components/PuntosRubroField';
import { toast } from 'react-toastify';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import yup from '@/utils/validaciones';
import { UserContext } from '@/components/context';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const EditarTemplates = ({ data, opcRubros, opcPreguntas, error }) => {
  const [idxRubroActual, setIdxRubroActual] = useState(0);
  const [rubros, setRubros] = useState(data.rubros || []);
  const [opcIdxRubros, setOpcIdxRubros] = useState([]);
  const [puntosRubros, setPuntosRubros] = useState(
    data?.rubros?.length
      ? data.rubros.reduce(
          (acum, _, idx) => ({
            ...acum,
            [idx]: data.rubros[idx].preguntas?.length
              ? data.rubros[idx].preguntas.reduce(
                  (a, pregunta) =>
                    pregunta?.puntos_pregunta
                      ? a + pregunta.puntos_pregunta
                      : a,
                  0
                )
              : 0,
          }),
          {}
        )
      : {}
  );
  const userDetails = useContext(UserContext);

  const opcRoles = [
    { value: 'SOLICITANTE', label: 'Solicitante' },
    { value: 'COMPRADOR', label: 'Comprador' },
  ];

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        nombre_template: yup.string().required().max(50),
        pide_comentario: yup.boolean(),
        rubros: yup.array().of(
          yup.object().shape({
            id_rubro: yup
              .number()
              .oneOf(opcRubros.map((opc) => opc.value))
              .required(),
            puntos_rubro: yup.number().integer().required(),
            rol_rubro: yup
              .string()
              .required()
              .oneOf(opcRoles.map((opc) => opc.value)),
            preguntas: yup.array().of(
              yup.object().shape({
                id_pregunta: yup
                  .number()
                  .required()
                  .integer()
                  .oneOf(opcPreguntas.map((opc) => opc.value)),
                puntos_pregunta: yup.number().integer().required(),
              })
            ),
          })
        ),
      }),
    []
  );

  const router = useRouter();

  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);

  useEffect(() => {
    setOpcIdxRubros(
      rubros
        .map((rubro, idx) => ({
          value: idx,
          label: `Rubro ${idx + 1}`,
        }))
        .filter((rubro) => rubros[rubro.value] !== 'eliminado')
    );
  }, [rubros]);

  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full justify-between border-b-2 font-bold border-gray-600">
          <h1>Templates</h1>
        </div>

        <Formik
          enableReinitialize={true}
          initialValues={data}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            // eslint-disable-next-line no-promise-executor-return

            if (values.rubros.length === 0) {
              toast.error(
                'Debe de existir por lo menos un rubro para cada rol'
              );
              return;
            }

            const rubrosActivos = values.rubros.filter(
              (rubro, idx) => rubros[idx] !== 'eliminado'
            );

            const rolesSolicitados = opcRoles.map((rol) => rol.value);

            if (
              !rolesSolicitados.every((rolSolicitado) =>
                rubrosActivos.some((rubro) => rubro.rol_rubro === rolSolicitado)
              )
            ) {
              toast.error(
                'Debe de existir por lo menos un rubro para cada rol'
              );
              return;
            }

            if (!rubrosActivos.every((rubro) => rubro.preguntas)) {
              toast.error(
                'Todos los rubros deben de tener por lo menos una pregunta'
              );
              return;
            }

            const puntosTemplate = Object.keys(puntosRubros).reduce(
              (acum, key) =>
                rubrosActivos[Number(key)] ? acum + puntosRubros[key] : acum,
              0
            );

            if (puntosTemplate !== 100) {
              toast.error(
                `La sumatoria de puntos de los rubros debe ser de 100. Actualmente es: ${puntosTemplate}`
              );
              return;
            }

            const totalPreguntasTemplate = rubrosActivos.reduce(
              (acum, rubro) => acum + rubro.preguntas.reduce((a) => a + 1, 0),
              0
            );

            const rubrosPlanos = rubrosActivos.map((rubro) => {
              return rubro?.preguntas?.map((pregunta) => ({
                ID_TEMPLATE: values?.id_template >= 0 ? values.id_template : -1,
                NOMBRE_TEMPLATE: values.nombre_template,
                TOTAL_RUBROS: rubrosActivos.length,
                TOTAL_PREGUNTAS_TEMPLATE: totalPreguntasTemplate,
                ID_RUBRO: rubro.id_rubro,
                TOTAL_PREGUNTAS_RUBRO: rubro.preguntas.length,
                PUNTOS_RUBRO: rubro.puntos_rubro,
                ROL_RUBRO: rubro.rol_rubro,
                ID_PREGUNTA: pregunta.id_pregunta,
                PUNTOS_PREGUNTA: pregunta.puntos_pregunta,
                INDICADOR_COMENTARIO: values.indicador_comentario,
                EN_USO: values.en_uso || false,
                ESTATUS: values.estatus || 'Activo',
                // AGREGADO_POR: values.AGREGADO_POR || userName || 'TEST',
                AGREGADO_POR:
                  values.AGREGADO_POR || userDetails.user_name || 'TEST',
                FECHA_AGREGADO: values.fecha_agregado || undefined,
                PIDE_COMENTARIO: values.pide_comentario || false,
              }));
            });

            const plano = {
              ID_TEMPLATE: values?.id_template >= 0 ? values.id_template : -1,
              NOMBRE_TEMPLATE: values.nombre_template,
              rubros: rubrosPlanos,
            };
            try {
              if (plano.ID_TEMPLATE >= 0) {
                await toast.promise(
                  axios.put(
                    `${config.url.API_URL}/api/administracion/encuestas/template/${plano.ID_TEMPLATE}/`,
                    plano
                  ),
                  {
                    pending: 'Guardando template',
                    success: 'Template guardada',
                    error: 'Error guardando el template',
                  }
                );
              } else {
                await toast.promise(
                  axios.post(
                    `${config.url.API_URL}/api/administracion/encuestas/templates/`,
                    plano
                  ),
                  {
                    pending: 'Guardando template',
                    success: 'Template guardada',
                    error: {
                      render(e) {
                        return e.data.response.data;
                      },
                    },
                  }
                );
              }
              router.push('/administracion/encuestas/templates');
            } catch (e) {
              console.log(e);
            }
          }}
        >
          {({ values, setFieldValue, submitForm }) => (
            <Form className="flex flex-col gap-4 w-full">
              <div className="flex w-full flex-col border-b-2 pl-4">
                <div className="flex flex-col">
                  <div className="group relative z-0 w-full">
                    <Field
                      id="nombre_template"
                      name="nombre_template"
                      placeholder=" "
                      className="peer block w-full appearance-none border-0 border-b-2 border-gray-600 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                    />
                    <label
                      className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 "
                      htmlFor="nombre_template"
                    >
                      Nombre del template:
                    </label>
                    <div className="text-red-500 text-sm">
                      <ErrorMessage name="nombre_template" />
                    </div>
                  </div>
                </div>

                <div className="pl-5">
                  <FieldArray name="rubros">
                    {(arrayHelpersRubros) => (
                      <div>
                        <div className="flex w-full pt-6 gap-3 pb-5">
                          <Select
                            placeholder="Rubro..."
                            inputId={'rubros'}
                            id={'rubros'}
                            className="w-full"
                            noOptionsMessage={() => 'No existen rubros'}
                            onChange={(e) => {
                              setIdxRubroActual(e.value);
                            }}
                            value={opcIdxRubros.filter(
                              (option) => option.value === idxRubroActual
                            )}
                            options={opcIdxRubros}
                          />
                          <Boton
                            tipo={Tipo.agregar}
                            type="button"
                            texto="Agregar rubro"
                            tema={Tema.blanco}
                            onClick={() => {
                              arrayHelpersRubros.push('');
                              setRubros((ant) => [...ant, '']);
                              setIdxRubroActual(
                                values.rubros ? values.rubros.length : 0
                              );
                            }}
                          />
                        </div>
                        {idxRubroActual !== undefined &&
                        values?.rubros?.length > 0 ? (
                          <div className="w-full justify-self-end border-l-2 border-gray-600 pl-6 pb-4">
                            <div className="flex pt-4 gap-5">
                              <div className="flex flex-col w-full">
                                <Field
                                  name={`rubros[${idxRubroActual}].id_rubro`}
                                  component={SelectField}
                                  noOptionsMessage={() => 'No existen rubros'}
                                  placeholder="Nombre del rubro..."
                                  options={opcRubros}
                                  className="w-full"
                                />

                                <div className="text-red-500 text-sm">
                                  <ErrorMessage
                                    name={`rubros[${idxRubroActual}].id_rubro`}
                                  />
                                </div>
                              </div>

                              <Boton
                                type="button"
                                texto="Eliminar rubro"
                                className="col-span-2 flex"
                                onClick={() => {
                                  Swal.fire({
                                    title: '¿Desea eliminar este rubro?',
                                    showCancelButton: true,
                                    confirmButtonText: 'Sí',
                                    confirmButtonColor: 'rgb(0,30,80)',
                                    cancelButtonText: 'No',
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      arrayHelpersRubros.remove(idxRubroActual);
                                    }
                                  });

                                  const tempIdx = idxRubroActual;
                                  // arrayHelpersRubros.remove(tempIdx);
                                  setFieldValue(`rubros[${tempIdx}]`, '');
                                  setIdxRubroActual(
                                    tempIdx - 1 >= 0 ? tempIdx - 1 : 0
                                  );
                                  setRubros((prev) => {
                                    const copia = [...prev];
                                    copia[tempIdx] = 'eliminado';
                                    return copia;
                                  });
                                }}
                              />
                            </div>
                            <FieldArray
                              name={`rubros[${idxRubroActual}].preguntas`}
                            >
                              {(arrayHelpersPreguntas) => (
                                <div className="w-full">
                                  <div
                                    className={`grid grid-cols-3 w-full items-end gap-5 pt-5 ${
                                      values.rubros &&
                                      values.rubros[idxRubroActual] &&
                                      values.rubros[idxRubroActual].preguntas
                                        ?.length
                                        ? 'border-b-2 border-gray-600'
                                        : ''
                                    } pb-5`}
                                  >
                                    <PuntosRubroField
                                      idx={idxRubroActual}
                                      puntosRubros={puntosRubros}
                                      setPuntosRubros={setPuntosRubros}
                                    />
                                    <div className="flex flex-col w-full">
                                      <Field
                                        name={`rubros[${idxRubroActual}].rol_rubro`}
                                        component={SelectField}
                                        noOptionsMessage={() =>
                                          'No existen roles'
                                        }
                                        options={opcRoles}
                                        placeholder="Rol..."
                                      />
                                      <div className="text-red-500 text-sm">
                                        <ErrorMessage
                                          name={`rubros[${idxRubroActual}].rol_rubro`}
                                        />
                                      </div>
                                    </div>
                                    <Boton
                                      tipo={Tipo.agregar}
                                      type="button"
                                      texto="Agregar pregunta"
                                      tema={Tema.blanco}
                                      className="justify-self-end"
                                      onClick={() =>
                                        arrayHelpersPreguntas.push('')
                                      }
                                    />
                                  </div>
                                  <div className="flex flex-col gap-5 pt-5">
                                    <div className="pb-8">
                                      {values.rubros &&
                                      values.rubros[idxRubroActual] &&
                                      values.rubros[idxRubroActual].preguntas
                                        ?.length ? (
                                        <div>
                                          <div className="grid w-full grid-cols-12 justify-items-center gap-x-6">
                                            <h2 className="col-span-2">No.</h2>
                                            <h2 className="col-span-6">
                                              Pregunta
                                            </h2>
                                            <h2 className="col-span-2">
                                              Puntuación
                                            </h2>
                                            <h2 className="col-span-2">
                                              Eliminar
                                            </h2>
                                          </div>
                                          {values.rubros &&
                                            values.rubros[idxRubroActual] &&
                                            values.rubros[idxRubroActual]
                                              .preguntas?.length &&
                                            values.rubros[
                                              idxRubroActual
                                            ].preguntas.map((pregunta, idx) => (
                                              <div
                                                key={idx}
                                                className={`grid w-full grid-cols-12 items-center justify-items-center gap-x-6 text-sm ${
                                                  idx % 2 === 0
                                                    ? 'bg-gray-100/50'
                                                    : 'bg-gray-200/50'
                                                }`}
                                              >
                                                <p className="col-span-2">
                                                  {idx + 1}
                                                </p>

                                                <div className="flex flex-col col-span-6 w-full">
                                                  <Field
                                                    name={`rubros[${idxRubroActual}].preguntas[${idx}].id_pregunta`}
                                                    component={SelectField}
                                                    noOptionsMessage={() =>
                                                      'No existen preguntas'
                                                    }
                                                    options={opcPreguntas}
                                                  />

                                                  <div className="text-red-500 text-sm">
                                                    <ErrorMessage
                                                      name={`rubros[${idxRubroActual}].preguntas[${idx}].id_pregunta`}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="col-span-2 w-full">
                                                  <Field
                                                    name={`rubros[${idxRubroActual}].preguntas[${idx}].puntos_pregunta`}
                                                    type="number"
                                                    className="border-0 border-b-2 border-gray-600 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                                  />

                                                  <div className="flex flex-col text-red-500 text-sm">
                                                    <ErrorMessage
                                                      name={`rubros[${idxRubroActual}].preguntas[${idx}].puntos_pregunta`}
                                                    />
                                                  </div>
                                                </div>
                                                <button
                                                  type="button"
                                                  className="col-span-2"
                                                  onClick={() =>
                                                    // arrayHelpersPreguntas.remove(
                                                    // idx
                                                    // )c
                                                    Swal.fire({
                                                      title:
                                                        '¿Desea eliminar esta pregunta?',
                                                      showCancelButton: true,
                                                      confirmButtonText: 'Sí',
                                                      confirmButtonColor:
                                                        'rgb(0,30,80)',
                                                      cancelButtonText: 'No',
                                                    }).then((result) => {
                                                      if (result.isConfirmed) {
                                                        arrayHelpersPreguntas.remove(
                                                          idx
                                                        );
                                                      }
                                                    })
                                                  }
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
                                    <div></div>
                                  </div>
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="flex gap-3 items-center justify-end">
                          <button
                            className="cursor-pointer"
                            onClick={() =>
                              setFieldValue(
                                'pide_comentario',
                                !values.pide_comentario
                              )
                            }
                          >
                            <label
                              className="cursor-pointer"
                              htmlFor="pide_comentario"
                            >
                              Habilitar campo de Comentarios Generales en la
                              encuesta
                            </label>
                          </button>
                          <Field
                            className="cursor-pointer"
                            name="pide_comentario"
                            type="checkbox"
                          />
                        </div>
                        <div className="flex w-full justify-end gap-5 pt-5">
                          <Boton
                            type="button"
                            tipo={Tipo.guardar}
                            texto="Cancelar"
                            tema={Tema.blanco}
                            onClick={() =>
                              Swal.fire({
                                title: '¿Desea salir sin guardar sus cambios?',
                                showCancelButton: true,
                                confirmButtonText: 'Sí',
                                confirmButtonColor: 'rgb(0,30,80)',
                                cancelButtonText: 'No',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  router.push(
                                    '/administracion/encuestas/templates'
                                  );
                                }
                              })
                            }
                          />
                          <Boton
                            type="button"
                            tipo={Tipo.guardar}
                            texto="Guardar"
                            onClick={() =>
                              Swal.fire({
                                title: '¿Desea guardar los cambios?',
                                showCancelButton: true,
                                confirmButtonText: 'Confirmar',
                                confirmButtonColor: 'rgb(0,30,80)',
                                cancelButtonText: 'Cancelar',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  submitForm();
                                }
                              })
                            }
                            tema={Tema.blanco}
                          />
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Main>
  );
};

export const getServerSideProps = async (ctx) => {
  // const session = await getSession(ctx);
  const { query } = ctx;
  // export const getServerSideProps = async () => {
  let data = {
    nombre_template: '',
    rubros: [],
  };
  let opcRubros = [];
  let opcPreguntas = [];
  let error = false;

  try {
    if (query.id !== 'agregar_template') {
      const dataRes = await fetch(
        `${config.url.API_URL}/api/administracion/encuestas/template/${query.id}/`
      );
      data = await dataRes.json();
    }

    const rubrosRes = await fetch(
      `${config.url.API_URL}/api/administracion/encuestas/rubros/`
    );

    const preguntasRes = await fetch(
      `${config.url.API_URL}/api/administracion/encuestas/preguntas/`
    );

    opcRubros = await rubrosRes.json();

    opcRubros = opcRubros
      .filter((rubro) => rubro.ESTATUS === 'Activo')
      .map((rubro) => ({
        value: rubro.ID_RUBRO,
        label: rubro.DESC_RUBRO,
      }));

    opcPreguntas = await preguntasRes.json();

    opcPreguntas = opcPreguntas
      .filter((pregunta) => pregunta.ESTATUS === 'Activa')
      .map((pregunta) => ({
        value: Number(pregunta.ID_PREGUNTA),
        label: pregunta.DESC_PREGUNTA,
      }));
  } catch (e) {
    console.log(e);
    error = true;
  }
  return {
    // ...comprobarPermisos(session, 'Administrador'),
    ...{
      props: {
        data,
        opcRubros,
        opcPreguntas,
        error,
        // userName: session?.user?.user_name,
      },
    },
  };
};

EditarTemplates.auth = true;
EditarTemplates.roles = ['Administrador'];
export default EditarTemplates;
// # sourceMappingURL=editar_templates.jsx.map
