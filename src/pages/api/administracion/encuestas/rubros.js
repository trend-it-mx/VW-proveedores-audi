import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `SELECT ID_RUBRO, DESC_RUBRO, ESTATUS, AGREGADO_POR, FECHA_AGREGADO FROM vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_RUBROS_WEB WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}" ORDER BY ID_RUBRO DESC`;

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
      MAX(ID_RUBRO) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_RUBROS_WEB
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
    }.CAT_RUBROS_WEB
  WITH
    MAXIMO AS (
    SELECT
      MAX(ID_RUBRO) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
        process.env.AMBIENTE_PROD
      }.CAT_RUBROS_WEB
    WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
  )
  SELECT
    ${maxi + 1} AS ID_RUBRO,
    "${req.body.rubro}" AS DESC_RUBRO,
    "Activo" AS ESTATUS,
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
      rubro: req.body.rubro,
      estatus: 'Activo',
    });
  }
}
