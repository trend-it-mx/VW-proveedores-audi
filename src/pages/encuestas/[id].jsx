/* eslint-disable no-template-curly-in-string */
import { useState, useEffect } from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import Select from 'react-select';
import Boton from '@/components/Boton';
import { Meta } from '@/layouts/Meta';
import Main from '@/templates/Main';
import { config } from '@/utils/constants';
import axios from 'axios';
import { Tema, Tipo } from '@/utils/Types';
import SelectField from '@/components/SelectField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
// import comprobarPermisos from '@/utils/comprobarPermisos';
// import { getSession } from 'next-auth/react';

const moverRubro = (idRubro, idsRubros, irSiguiente, setIdxRubroActual) => {
  const idValido = idsRubros.findIndex(({ value }) => value === idRubro);

  if (irSiguiente) {
    if (idValido === idsRubros.length - 1) {
      return;
    }
    setIdxRubroActual(idValido + 1);
    return;
  }

  if (idValido === 0) {
    return;
  }

  setIdxRubroActual(idValido - 1);
};

const EditarTemplates = ({ data, error }) => {
  const [idxRubroActual, setIdxRubroActual] = useState(0);
  const [rubros] = useState(data.RUBROS || []);
  const [opcIdxRubros, setOpcIdxRubros] = useState([]);
  const [puedeEditar] = useState(
    !(
      (data.ESTATUS !== 'EN PROCESO' && data.ESTATUS !== 'GENERADA') ||
      data.INTENTOS_REALIZADOS >= data.INTENTOS_PERMITIDOS
    )
  );
  const router = useRouter();

  useEffect(() => {
    if (error) toast.error('Hubo un problema contactando al servidor.');
  }, [error]);

  useEffect(() => {
    if (rubros) {
      setOpcIdxRubros(
        rubros
          .map((rubro, idx) => ({
            value: idx,
            label: `Rubro: ${rubro.DESC_RUBRO}`,
          }))
          .filter((rubro) => rubros[rubro.value] !== 'eliminado')
      );
    }
  }, [rubros]);

  return (
    <Main meta={<Meta title="Componentes" description="Componentes" />}>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col justify-between border-b-2 border-gray-600">
          <h1>
            Encuesta de evaluación al proveedor:{' '}
            <span className="font-bold">{data.PROVEEDOR}</span>
          </h1>
          <h1>
            Orden de compra:{' '}
            <span className="font-bold">{data.ORDEN_COMPRA}</span>
          </h1>
        </div>

        <Formik
          enableReinitialize={true}
          initialValues={data}
          onSubmit={async (values) => {
            if (!puedeEditar) {
              toast.error(
                'No es posible cambiar las respuestas de esta encuesta.'
              );
              return;
            }

            const plano = {
              TERMINADA: values.TERMINADA,
              INTENTOS_REALIZADOS: data.INTENTOS_REALIZADOS,
              ID_REGISTRO_ENCUESTA: values.ID_REGISTRO_ENCUESTA,
              COMENTARIO: values.COMENTARIO,
              // eslint-disable-next-line no-nested-ternary
              ESTATUS: values.TERMINADA ? 'TERMINADA' : 'EN PROCESO',
              RESPUESTAS: values.RUBROS.map((rubro) => {
                return rubro?.PREGUNTAS?.map((pregunta) => ({
                  ID_REGISTRO_ENCUESTA: values.ID_REGISTRO_ENCUESTA,
                  ID_RUBRO: rubro.ID_RUBRO,
                  ID_PREGUNTA: pregunta.ID_PREGUNTA,
                  RESPUESTA: pregunta.RESPUESTA,
                }));
              }),
            };
            // console.log(JSON.stringify(plano, null, 2));

            await toast.promise(
              axios.put(
                `${config.url.API_URL}/api/usuarios/encuesta/${plano.ID_REGISTRO_ENCUESTA}/`,
                plano
              ),
              {
                pending: 'Guardando respuestas',
                success: 'Respuestas guardadas',
                error: 'Error guardando las respuestas',
              }
            );

            if (values.TERMINADA) {
              router.push('/encuestas');
            }
          }}
        >
          {({ values, setFieldValue, submitForm }) => (
            <Form className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-2 gap-y-2 grid-flow-rows border-b-2 pl-4 border-gray-600">
                <p>
                  Fecha de generación:{' '}
                  <span className="font-bold">{values.FECHA_GENERADA}</span>
                </p>
                <p>
                  Fecha límite:{' '}
                  <span className="font-bold">{values.FECHA_LIMITE}</span>
                </p>

                <p>
                  Intentos realizados:{' '}
                  <span className="font-bold">
                    {values.INTENTOS_REALIZADOS}
                  </span>
                </p>
                <p>
                  Intentos permitidos:{' '}
                  <span className="font-bold">
                    {values.INTENTOS_PERMITIDOS}
                  </span>
                </p>

                <p>
                  Comprador:{' '}
                  <span className="font-bold">{values.COMPRADOR}</span>
                </p>
                <p>
                  Solicitante:{' '}
                  <span className="font-bold">{values.SOLICITANTE}</span>
                </p>
              </div>
              <div className="flex w-full flex-col pl-4">
                <div className="pl-5">
                  <FieldArray name="RUBROS">
                    {() => (
                      <div>
                        <div className="flex w-full pt-3 gap-3 items-center">
                          <Select
                            styles={{
                              option: (styles) => ({
                                ...styles,
                                cursor: 'pointer',
                              }),
                              control: (styles) => ({
                                ...styles,
                                cursor: 'pointer',
                              }),
                            }}
                            placeholder="Rubro..."
                            noOptionsMessage={() => 'No existen rubros'}
                            onChange={(e) => {
                              setIdxRubroActual(e.value);
                            }}
                            className="w-full cursor-pointer"
                            value={opcIdxRubros.filter(
                              (option) => option.value === idxRubroActual
                            )}
                            options={opcIdxRubros}
                          />
                          <Boton
                            type="button"
                            texto="Anterior"
                            onClick={() =>
                              moverRubro(
                                idxRubroActual,
                                opcIdxRubros,
                                false,
                                setIdxRubroActual
                              )
                            }
                          />
                          <Boton
                            type="button"
                            texto="Siguiente"
                            onClick={() =>
                              moverRubro(
                                idxRubroActual,
                                opcIdxRubros,
                                true,
                                setIdxRubroActual
                              )
                            }
                          />
                          <span className="w-1/4 text-center font-bold">
                            Rubro {idxRubroActual + 1} de {opcIdxRubros.length}
                          </span>
                        </div>
                        {idxRubroActual !== undefined &&
                        values?.RUBROS?.length > 0 ? (
                          <div className="w-full justify-self-end pl-8">
                            <div className="border-l-2 border-gray-600 pl-4">
                              <FieldArray
                                name={`RUBROS[${idxRubroActual}].PREGUNTAS`}
                              >
                                {() => (
                                  <div className="w-full">
                                    <div className="flex flex-col gap-5 pt-5">
                                      <div className="">
                                        {values.RUBROS &&
                                        values.RUBROS[idxRubroActual] &&
                                        values.RUBROS[idxRubroActual].PREGUNTAS
                                          ?.length ? (
                                          <div className="flex flex-col">
                                            <div className="grid w-full grid-cols-12 justify-items-center items-start gap-x-6">
                                              <h2 className="col-span-10">
                                                Pregunta
                                              </h2>
                                              <h2 className="col-span-2">
                                                Respuesta
                                              </h2>
                                            </div>
                                            {values.RUBROS &&
                                              values.RUBROS[idxRubroActual] &&
                                              values.RUBROS[idxRubroActual]
                                                .PREGUNTAS?.length &&
                                              values.RUBROS[
                                                idxRubroActual
                                              ].PREGUNTAS.map(
                                                (PREGUNTA, idx) => (
                                                  <div
                                                    key={idx}
                                                    className={`grid w-full grid-cols-12 items-center justify-items-center py-1 gap-x-6 text-sm ${
                                                      idx % 2 === 0
                                                        ? 'bg-gray-100/50'
                                                        : 'bg-gray-200/50'
                                                    }`}
                                                  >
                                                    <p className="col-span-10 w-full pl-2">
                                                      {
                                                        values.RUBROS[
                                                          idxRubroActual
                                                        ].PREGUNTAS[idx]
                                                          .DESC_PREGUNTA
                                                      }
                                                    </p>
                                                    <Field
                                                      isDisabled={!puedeEditar}
                                                      name={`RUBROS[${idxRubroActual}].PREGUNTAS[${idx}].RESPUESTA`}
                                                      component={SelectField}
                                                      noOptionsMessage={() =>
                                                        'No existe puntaje'
                                                      }
                                                      placeholder="Respuesta..."
                                                      options={Array.from(
                                                        {
                                                          length: 5,
                                                        },
                                                        (v, i) => ({
                                                          value:
                                                            (values.RUBROS[
                                                              idxRubroActual
                                                            ].PREGUNTAS[idx]
                                                              .PUNTUACION_MAXIMA /
                                                              5) *
                                                            (i + 1),
                                                          label: i + 1,
                                                        })
                                                      )}
                                                      className="col-span-2 w-full bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                                    />
                                                  </div>
                                                )
                                              )}
                                            <div className="flex w-full justify-end items-end gap-3 pt-4">
                                              <Boton
                                                type="button"
                                                texto="Anterior"
                                                onClick={() =>
                                                  moverRubro(
                                                    idxRubroActual,
                                                    opcIdxRubros,
                                                    false,
                                                    setIdxRubroActual
                                                  )
                                                }
                                              />
                                              <Boton
                                                type="button"
                                                texto="Siguiente"
                                                onClick={() =>
                                                  moverRubro(
                                                    idxRubroActual,
                                                    opcIdxRubros,
                                                    true,
                                                    setIdxRubroActual
                                                  )
                                                }
                                              />
                                            </div>
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
                          </div>
                        ) : (
                          <></>
                        )}

                        {values.PIDE_COMENTARIO && (
                          <div className="flex flex-col pt-5 gap-2">
                            <label htmlFor="COMENTARIO">
                              Comentario general:
                            </label>
                            <Field
                              disabled={!puedeEditar}
                              name="COMENTARIO"
                              as="textarea"
                              className="border-2 border-gray-600 rounded"
                            />
                          </div>
                        )}

                        {puedeEditar ? (
                          <div className="flex w-full justify-end gap-5 pt-5 pb-32">
                            <Boton
                              type="button"
                              tipo={Tipo.guardar}
                              texto="Cancelar"
                              tema={Tema.blanco}
                              onClick={() => router.push('/encuestas')}
                            />
                            <Boton
                              type="submit"
                              tipo={Tipo.guardar}
                              texto="Guardar"
                              tema={Tema.blanco}
                            />
                            <Boton
                              type="button"
                              tipo={Tipo.guardar}
                              texto="Terminar encuesta"
                              onClick={() => {
                                if (
                                  values.RUBROS.find((rubro) =>
                                    rubro.PREGUNTAS.find(
                                      (pregunta) => pregunta.RESPUESTA === 0
                                    )
                                  )
                                ) {
                                  toast.error(
                                    'Debes responder todas las preguntas para terminar la encuesta.'
                                  );
                                  return;
                                }
                                setFieldValue('TERMINADA', true);
                                submitForm();
                              }}
                              tema={Tema.blanco}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
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

EditarTemplates.auth = true;
EditarTemplates.roles = ['Comprador', 'Solicitante'];

export const getServerSideProps = async (ctx) => {
  // export const getServerSideProps = async () => {

  // const session = await getSession(ctx);

  let data = {};
  let error = false;
  try {
    const dataRes = await axios.get(
      `${config.url.API_URL}/api/usuarios/encuesta/${ctx.query.id || -1}/`
    );

    data = dataRes.data;
  } catch {
    error = true;
  }
  return {
    // ...comprobarPermisos(session, ['Comprador', 'Solicitante']),
    ...{
      props: {
        data,
        error,
      },
    },
  };
};

export default EditarTemplates;
// # sourceMappingURL=editar_templates.jsx.map
