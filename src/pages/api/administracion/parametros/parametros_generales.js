import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `SELECT * EXCEPT (ACTUALIZADO_POR, FECHA_ACTUALIZACION) FROM vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PARAMETROS_AUDI ORDER BY ID_CONFIGURACION DESC LIMIT 1`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows[0]);
  } else if (req.method === 'POST') {
    let query = `
    SELECT
      MAX(ID_CONFIGURACION) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PARAMETROS_AUDI`;
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
    }.CAT_PARAMETROS_AUDI
  WITH
    MAXIMO AS (
    SELECT
      MAX(ID_CONFIGURACION) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
        process.env.AMBIENTE_PROD
      }.CAT_PARAMETROS_AUDI)
  SELECT
    ${maxi + 1} AS ID_CONFIGURACION,
    "${req.body.AMBIENTE}" AS AMBIENTE,
    "${req.body.MONEDA}" AS MONEDA,
    ${req.body.MONTO_MINIMO} AS MONTO_MINIMO,
    ${req.body.PORC_FACTURACION} AS PORC_FACTURACION,	
    ${req.body.DIAS_POSTERIORES_ENTREGA} AS DIAS_POSTERIORES_ENTREGA,	
    ${req.body.SUFIJO_ORDENES_ABIERTAS} AS SUFIJO_ORDENES_ABIERTAS,	
    ${req.body.SUFIJO_ORDENES_CERRADAS} AS SUFIJO_ORDENES_CERRADAS,	
    ${req.body.DIAS_RESPUESTA_COMPRADOR} AS DIAS_RESPUESTA_COMPRADOR,	
    ${req.body.DIAS_RESPUESTA_SOLICITANTE} AS DIAS_RESPUESTA_SOLICITANTE,	
    ${req.body.INTENTOS_COMPRADOR} AS INTENTOS_COMPRADOR,	
    ${req.body.INTENTOS_SOLICITANTE} AS INTENTOS_SOLICITANTE,	
    "${req.body.user_name || 'TEST'}" AS ACTUALIZADO_POR,
    CURRENT_TIMESTAMP() AS FECHA_ACTUALIZACION,
    ${req.body.TEMPLATE} AS TEMPLATE
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
    });
  }
}
// # sourceMappingURL=preguntas.js.map
