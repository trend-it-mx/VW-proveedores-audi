import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `SELECT ID_PREGUNTA, DESC_PREGUNTA, ESTATUS, EN_USO FROM vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PREGUNTAS_WEB WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}" ORDER BY ID_PREGUNTA DESC`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    let query = `
    SELECT
      MAX(ID_PREGUNTA) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PREGUNTAS_WEB
    WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"`;
    let options = {
      query,
      location: 'EU',
    };
    let [job] = await bigquery.createQueryJob(options);
    let [rows] = await job.getQueryResults();
    const maxi = Number(rows[0].MAXI);
    query = `INSERT INTO
    vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
      process.env.AMBIENTE_PROD
    }.CAT_PREGUNTAS_WEB
  WITH
    MAXIMO AS (
    SELECT
      MAX(ID_PREGUNTA) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
        process.env.AMBIENTE_PROD
      }.CAT_PREGUNTAS_WEB
    WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    )
  SELECT
    CAST(${maxi + 1} AS STRING) AS ID_PREGUNTA,
    "${req.body.pregunta}" AS DESC_PREGUNTA,
    "Activa" AS ESTATUS,
    "${req.body.user_name || 'TEST'}" AS AGREGADO_POR,
    CURRENT_TIMESTAMP() AS FECHA_AGREGADO,
    "NO" AS EN_USO,
    "${process.env.NEXT_PUBLIC_SISTEMA}" AS SISTEMA
  FROM
    MAXIMO`;
    options = {
      query,
      location: 'EU',
    };
    [job] = await bigquery.createQueryJob(options);
    [rows] = await job.getQueryResults();
    res.status(200).json({
      id: Number(maxi) + 1,
      pregunta: req.body.pregunta,
      estatus: 'Activa',
    });
  }
}
// # sourceMappingURL=preguntas.js.map
