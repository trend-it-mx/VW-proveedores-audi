import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function userHandler(req, res) {
  await NextCors(req, res, corsOptions);
  const {
    query: { id },
    method,
  } = req;
  if (method === 'GET') {
    const query = `
    SELECT
      ENC.ID_REGISTRO_ENCUESTA,
      ENC.ID_ENCUESTA,
      CAB.PROVEEDOR,
      CAB.ESTATUS,
      CAB.INTENTOS_REALIZADOS,
      CAB.FECHA_GENERADA,
      CAB.FECHA_LIMITE,
      CAB.INTENTOS_PERMITIDOS,
      CAB.SOLICITANTE,
      CAB.COMPRADOR,
      CAB.PIDE_COMENTARIO,
      CAB.COMENTARIO,
      CAB.ORDEN_COMPRA,
      ENC.ID_PREGUNTA,
      PRE.DESC_PREGUNTA,
      ENC.PUNTUACION_MAXIMA,
      ENC.RESPUESTA,
      ENC.ID_RUBRO,
      RUB.DESC_RUBRO
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ENCUESTAS_CUERPO ENC
    LEFT JOIN
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ENCUESTAS_ENCABEZADO CAB
    ON
      ENC.ID_REGISTRO_ENCUESTA = CAB.ID_REGISTRO
    LEFT JOIN
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PREGUNTAS_WEB PRE
    ON
      CAST(ENC.ID_PREGUNTA AS STRING) = PRE.ID_PREGUNTA
    LEFT JOIN
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_RUBROS_WEB RUB
    ON
      ENC.ID_RUBRO = RUB.ID_RUBRO
    WHERE
      ID_REGISTRO_ENCUESTA = "${id}"
      AND ENC.SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    ORDER BY
      ENC.ID_PREGUNTA
    `;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    if (rows.length) {
      const hash = rows.reduce((acum, row) => {
        if (acum[row.ID_RUBRO]) {
          return {
            ...acum,
            [row.ID_RUBRO]: {
              ...acum[row.ID_RUBRO],
              PREGUNTAS: [
                ...acum[row.ID_RUBRO].PREGUNTAS,
                {
                  ID_PREGUNTA: row.ID_PREGUNTA,
                  DESC_PREGUNTA: row.DESC_PREGUNTA,
                  PUNTUACION_MAXIMA: row.PUNTUACION_MAXIMA,
                  RESPUESTA: row.RESPUESTA,
                },
              ],
            },
          };
        }
        return {
          ...acum,
          [row.ID_RUBRO]: {
            DESC_RUBRO: row.DESC_RUBRO,
            PREGUNTAS: [
              {
                ID_PREGUNTA: row.ID_PREGUNTA,
                DESC_PREGUNTA: row.DESC_PREGUNTA,
                PUNTUACION_MAXIMA: row.PUNTUACION_MAXIMA,
                RESPUESTA: row.RESPUESTA,
              },
            ],
          },
        };
      }, {});

      const rubros = Object.keys(hash).map((idRubro) => ({
        ID_RUBRO: idRubro,
        DESC_RUBRO: hash[idRubro].DESC_RUBRO,
        PREGUNTAS: hash[idRubro].PREGUNTAS,
      }));

      res.status(200).json({
        ID_REGISTRO_ENCUESTA: rows[0]?.ID_REGISTRO_ENCUESTA,
        ID_ENCUESTA: rows[0]?.ID_ENCUESTA,
        PROVEEDOR: rows[0]?.PROVEEDOR,
        INTENTOS_REALIZADOS: rows[0]?.INTENTOS_REALIZADOS,
        ESTATUS: rows[0]?.ESTATUS,
        FECHA_GENERADA: rows[0]?.FECHA_GENERADA.value,
        FECHA_LIMITE: rows[0]?.FECHA_LIMITE.value,
        INTENTOS_PERMITIDOS: rows[0]?.INTENTOS_PERMITIDOS,
        SOLICITANTE: rows[0]?.SOLICITANTE,
        COMPRADOR: rows[0]?.COMPRADOR,
        PIDE_COMENTARIO: rows[0]?.PIDE_COMENTARIO,
        COMENTARIO: rows[0]?.COMENTARIO,
        ORDEN_COMPRA: rows[0]?.ORDEN_COMPRA,
        RUBROS: rubros,
      });
    } else {
      res.status(200).json({});
    }
  } else if (method === 'PUT') {
    const encuesta = req.body;
    const queryEstatus = `
      UPDATE
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ENCUESTAS_ENCABEZADO
      SET
        ESTATUS= "${encuesta.ESTATUS}"
      WHERE
        ID_REGISTRO = "${encuesta.ID_REGISTRO_ENCUESTA}"
        AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
      `;

    const optionsEstatus = {
      query: queryEstatus,
      location: 'EU',
    };

    let [job] = await bigquery.createQueryJob(optionsEstatus);
    await job.getQueryResults();

    if (encuesta.TERMINADA) {
      const queryEncabezado = `
      UPDATE
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ENCUESTAS_ENCABEZADO
      SET
        INTENTOS_REALIZADOS = ${encuesta.INTENTOS_REALIZADOS}
      WHERE
        ID_REGISTRO = "${encuesta.ID_REGISTRO_ENCUESTA}"
        AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
      `;

      const options = {
        query: queryEncabezado,
        location: 'EU',
      };

      [job] = await bigquery.createQueryJob(options);
      await job.getQueryResults();
    }

    const trans = encuesta.RESPUESTAS.map((rubro) =>
      rubro.map(
        (pregunta) =>
          `
    STRUCT(
      "${pregunta.ID_REGISTRO_ENCUESTA}" AS ID_REGISTRO_ENCUESTA,
      ${pregunta.ID_RUBRO} AS ID_RUBRO,
      ${pregunta.ID_PREGUNTA} AS ID_PREGUNTA,
      ${pregunta.RESPUESTA} AS RESPUESTA
    )`
      )
    );

    const queryCuerpo = `
        CREATE OR REPLACE TABLE vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ENCUESTAS_CUERPO AS
          WITH NUEVOS AS (
            SELECT
              ID_REGISTRO_ENCUESTA,
              ID_PREGUNTA,
              ID_RUBRO,
              RESPUESTA
            FROM
              UNNEST(
                [
                  ${trans}
                ]
              )
          )
          SELECT
            ENCUESTA.ID_REGISTRO_ENCUESTA,
            ENCUESTA.ID_ENCUESTA,
            ENCUESTA.NOMBRE_TEMPLATE,
            ENCUESTA.USUARIO_ENCUESTADO,
            ENCUESTA.ID_PREGUNTA,
            ENCUESTA.PUNTUACION_MAXIMA,
            COALESCE(RES.RESPUESTA, ENCUESTA.RESPUESTA) AS RESPUESTA,
            ENCUESTA.ID_RUBRO,
            ENCUESTA.ROL_RUBRO,
            ENCUESTA.SISTEMA
          FROM
            vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ENCUESTAS_CUERPO ENCUESTA
          LEFT JOIN
            NUEVOS RES
          ON
            ENCUESTA.ID_REGISTRO_ENCUESTA = RES.ID_REGISTRO_ENCUESTA
            AND ENCUESTA.ID_PREGUNTA = RES.ID_PREGUNTA
            AND ENCUESTA.ID_RUBRO = RES.ID_RUBRO
        `;
    const options = {
      query: queryCuerpo,
      location: 'EU',
    };
    [job] = await bigquery.createQueryJob(options);
    await job.getQueryResults();

    const queryComentario = `
        UPDATE
          vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
            process.env.AMBIENTE_PROD
          }.TB_ENCUESTAS_ENCABEZADO
        SET
          COMENTARIO = "${!encuesta.COMENTARIO ? '' : encuesta.COMENTARIO}"
        WHERE
          ID_REGISTRO = "${encuesta.ID_REGISTRO_ENCUESTA}"
          AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
        `;
    const optionsComentario = {
      query: queryComentario,
      location: 'EU',
    };
    [job] = await bigquery.createQueryJob(optionsComentario);
    await job.getQueryResults();

    res.status(200).json(encuesta);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
// # sourceMappingURL=%5Bid%5D.js.map
