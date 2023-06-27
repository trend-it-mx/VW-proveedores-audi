import { BigQuery } from '@google-cloud/bigquery';
import actualizarPreguntas from '@/utils/actualizarPreguntas';
import actualizarRubros from '@/utils/actualizarRubros';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  const {
    query: { id },
    method,
  } = req;
  if (method === 'GET') {
    const query = `SELECT
    *
  FROM
    vw-vwm-bi-anagp-p-evalpro-l44.STG_${
      process.env.AMBIENTE_PROD
    }.CAT_TEMPLATES_ENCUESTA_WEB
  WHERE ID_TEMPLATE = ${Number(id)} AND SISTEMA = "${
      process.env.NEXT_PUBLIC_SISTEMA
    }"
  ORDER BY ID_RUBRO DESC, ID_PREGUNTA DESC`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    let data = {
      id_template: -1,
      nombre_template: '',
      total_rubros: 0,
      indicador_comentario: '',
      fecha_agregado: undefined,
      estatus: '',
      en_uso: '',
      agregado_por: '',
      pide_comentario: false,
      rubros: [],
    };
    if (rows.length !== 0) {
      const rubrosAgrupados = rows.reduce((acum, row) => {
        const copiaAcum = { ...acum };
        (copiaAcum[row.ID_RUBRO] = copiaAcum[row.ID_RUBRO] || []).push({
          id_rubro: row.ID_RUBRO,
          rol_rubro: row.ROL_RUBRO,
          total_preguntas_rubro: row.TOTAL_PREGUNTAS_RUBRO,
          id_pregunta: row.ID_PREGUNTA,
          puntos_pregunta: row.PUNTOS_PREGUNTA,
          puntos_rubro: row.PUNTOS_RUBRO,
        });
        return copiaAcum;
      }, {});
      const rubrosFinales = Object.keys(rubrosAgrupados).map((key) => ({
        id_rubro: rubrosAgrupados[key][0].id_rubro,
        rol_rubro: rubrosAgrupados[key][0].rol_rubro,
        puntos_rubro: rubrosAgrupados[key][0].puntos_rubro,
        total_preguntas_rubro: rubrosAgrupados[key][0].total_preguntas_rubro,
        preguntas: rubrosAgrupados[key].map((pregunta) => ({
          id_pregunta: pregunta.id_pregunta,
          puntos_pregunta: pregunta.puntos_pregunta,
        })),
      }));
      data = {
        id_template: rows[0].ID_TEMPLATE,
        nombre_template: rows[0].NOMBRE_TEMPLATE,
        total_rubros: rows[0].TOTAL_RUBROS,
        indicador_comentario: rows[0].INDICADOR_COMENTARIO,
        fecha_agregado: rows[0].FECHA_AGREGADO.value,
        en_uso: rows[0].EN_USO,
        estatus: rows[0].ESTATUS,
        agregado_por: rows[0].AGREGADO_POR,
        pide_comentario: rows[0].PIDE_COMENTARIO,
        rubros: rubrosFinales,
      };
    }

    res.status(200).json(data);
  } else if (method === 'PUT') {
    if (req.body?.EN_USO) {
      const querySi = `
        UPDATE
          vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB
        SET
          EN_USO = true
        WHERE
          ID_TEMPLATE = ${req.query.id}
          AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
      `;

      const [jobSi] = await bigquery.createQueryJob({
        query: querySi,
        location: 'EU',
      });
      await jobSi.getQueryResults();

      const queryNo = `
        UPDATE
          vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB
        SET
          EN_USO = false
        WHERE
          ID_TEMPLATE != ${req.query.id}
          AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
      `;

      const [jobNo] = await bigquery.createQueryJob({
        query: queryNo,
        location: 'EU',
      });
      await jobNo.getQueryResults();
      res.status(200).json(req.body);
      return;
    }

    if (req.body?.estatus) {
      const query = `
        UPDATE
          vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB
        SET
          ESTATUS = "${req.body.estatus}"
        WHERE
          ID_TEMPLATE = ${req.query.id}
          AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
      `;
      // console.log(query);

      const options = {
        query,
        location: 'EU',
      };
      const [job] = await bigquery.createQueryJob(options);
      await job.getQueryResults();
    } else {
      const template = req.body;
      // console.log(template.rubros);

      const trans = template.rubros.map((rubro) =>
        rubro.map(
          (reg) =>
            `
        STRUCT(
          ${reg.ID_TEMPLATE} AS ID_TEMPLATE,
          "${reg.NOMBRE_TEMPLATE}" AS NOMBRE_TEMPLATE,
          ${reg.TOTAL_RUBROS} AS TOTAL_RUBROS,
          ${reg.TOTAL_PREGUNTAS_TEMPLATE} AS TOTAL_PREGUNTAS_TEMPLATE,
          ${reg.ID_RUBRO} AS ID_RUBRO,
          ${reg.TOTAL_PREGUNTAS_RUBRO} AS TOTAL_PREGUNTAS_RUBRO,
          "${reg.ROL_RUBRO}" AS ROL_RUBRO,
          ${reg.PUNTOS_RUBRO} AS PUNTOS_RUBRO,
          ${reg.ID_PREGUNTA} AS ID_PREGUNTA,
          ${reg.PUNTOS_PREGUNTA} AS PUNTOS_PREGUNTA,
          ${reg.EN_USO} AS EN_USO,
          "${reg.ESTATUS}" AS ESTATUS,
          "${reg.AGREGADO_POR}" AS AGREGADO_POR,
          CAST("${reg.FECHA_AGREGADO}" AS DATE) AS FECHA_AGREGADO,
          "${process.env.NEXT_PUBLIC_SISTEMA}" AS SISTEMA,
          ${reg.PIDE_COMENTARIO} AS PIDE_COMENTARIO
        )`
        )
      );

      // console.log(trans);

      const query = `
        CREATE OR REPLACE TABLE vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB AS
          WITH NUEVOS AS (
            SELECT
              *
            FROM
              UNNEST(
                [
                  ${trans}
                ]
              )
          )
          SELECT
            COALESCE(RES.ID_TEMPLATE, TEMPLATE.ID_TEMPLATE) AS ID_TEMPLATE,
            COALESCE(RES.NOMBRE_TEMPLATE, TEMPLATE.NOMBRE_TEMPLATE) AS NOMBRE_TEMPLATE,
            COALESCE(RES.TOTAL_RUBROS, TEMPLATE.TOTAL_RUBROS) AS TOTAL_RUBROS,
            COALESCE(RES.TOTAL_PREGUNTAS_TEMPLATE, TEMPLATE.TOTAL_PREGUNTAS_TEMPLATE) AS TOTAL_PREGUNTAS_TEMPLATE,
            COALESCE(RES.ID_RUBRO, TEMPLATE.ID_RUBRO) AS ID_RUBRO,
            COALESCE(RES.TOTAL_PREGUNTAS_RUBRO, TEMPLATE.TOTAL_PREGUNTAS_RUBRO) AS TOTAL_PREGUNTAS_RUBRO,
            COALESCE(RES.ROL_RUBRO, TEMPLATE.ROL_RUBRO) AS ROL_RUBRO,
            COALESCE(RES.PUNTOS_RUBRO, TEMPLATE.PUNTOS_RUBRO) AS PUNTOS_RUBRO,
            COALESCE(RES.ID_PREGUNTA, TEMPLATE.ID_PREGUNTA) AS ID_PREGUNTA,
            COALESCE(RES.PUNTOS_PREGUNTA, TEMPLATE.PUNTOS_PREGUNTA) AS PUNTOS_PREGUNTA,
            COALESCE(RES.EN_USO, TEMPLATE.EN_USO) AS EN_USO,
            COALESCE(RES.ESTATUS, TEMPLATE.ESTATUS) AS ESTATUS,
            COALESCE(RES.AGREGADO_POR, TEMPLATE.AGREGADO_POR) AS AGREGADO_POR,
            COALESCE(RES.FECHA_AGREGADO, TEMPLATE.FECHA_AGREGADO) AS FECHA_AGREGADO,
            COALESCE(RES.SISTEMA, TEMPLATE.SISTEMA) AS SISTEMA,
            COALESCE(RES.PIDE_COMENTARIO, TEMPLATE.PIDE_COMENTARIO) AS PIDE_COMENTARIO
            FROM
            (
              SELECT
                *
              FROM
                vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB
              WHERE
                (
                  ID_TEMPLATE != ${template.ID_TEMPLATE}
                  AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
                )
                || SISTEMA != "${process.env.NEXT_PUBLIC_SISTEMA}"
            ) TEMPLATE
          FULL OUTER JOIN
            NUEVOS RES
          ON
            TEMPLATE.ID_TEMPLATE = RES.ID_TEMPLATE
            AND TEMPLATE.ID_RUBRO = RES.ID_RUBRO
            AND TEMPLATE.ID_PREGUNTA = RES.ID_PREGUNTA
        `;
      // console.log(query);
      const options = {
        query,
        location: 'EU',
      };
      const [job] = await bigquery.createQueryJob(options);
      await job.getQueryResults();

      actualizarPreguntas();
      actualizarRubros();
    }

    res.status(200).json(req.body);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
// # sourceMappingURL=%5Bid%5D.js.map
