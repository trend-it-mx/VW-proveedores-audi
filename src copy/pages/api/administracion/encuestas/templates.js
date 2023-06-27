import { BigQuery } from '@google-cloud/bigquery';
import actualizarPreguntas from '@/utils/actualizarPreguntas';
import actualizarRubros from '@/utils/actualizarRubros';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `SELECT DISTINCT ID_TEMPLATE, NOMBRE_TEMPLATE, TOTAL_PREGUNTAS_TEMPLATE, ESTATUS, EN_USO FROM vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}" ORDER BY ID_TEMPLATE DESC`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    const query = `
    SELECT
      MAX(ID_TEMPLATE) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB
    WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    `;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    const maxi = Number(rows[0].MAXI) + 1;

    const template = req.body;

    const queryDuplicados = `
      SELECT
        ID_TEMPLATE
      FROM
        vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB
      WHERE
        NOMBRE_TEMPLATE = "${template.NOMBRE_TEMPLATE}"
    `;

    const [jobDuplicados] = await bigquery.createQueryJob({
      query: queryDuplicados,
      location: 'EU',
    });
    const [resDuplicados] = await jobDuplicados.getQueryResults();

    if (resDuplicados.length > 0) {
      res.status(400).json('Este template ya existe');
      return;
    }

    const trans = template.rubros.map((rubro) =>
      rubro.map(
        (reg) =>
          `
        STRUCT(
          ${maxi} AS ID_TEMPLATE,
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
          CURRENT_DATE() AS FECHA_AGREGADO,
          "${process.env.NEXT_PUBLIC_SISTEMA}" AS SISTEMA,
          ${reg.PIDE_COMENTARIO} AS PIDE_COMENTARIO
        )`
      )
    );

    const queryTemplate = `
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
            *
          FROM
            vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB
          UNION ALL
          SELECT
            *
          FROM
            NUEVOS
        `;

    const [jobTemplate] = await bigquery.createQueryJob({
      query: queryTemplate,
      location: 'EU',
    });
    await jobTemplate.getQueryResults();

    actualizarPreguntas();
    actualizarRubros();
    res.status(200).json(template);
  }
}
