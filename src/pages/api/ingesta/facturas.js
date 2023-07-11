import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `SELECT ID_ARCHIVO, NOMBRE_ARCHIVO, FECHA_CARGA, ESTATUS FROM vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ARCHIVOS_FACTURAS WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}" ORDER BY ID_ARCHIVO DESC`;
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
      MAX(ID_ARCHIVO) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ARCHIVOS_FACTURAS
      WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"`;
    let options = {
      query,
      location: 'EU',
    };
    let [job] = await bigquery.createQueryJob(options);
    let [rows] = await job.getQueryResults();
    const maxi = Number(rows[0].MAXI);
    const archivo = {
      id: maxi + 1,
      estatus: 'ACTIVO',
      archivo: decodeURI(req.body.archivo),
      fecha_y_hora_ingesta: new Date().toISOString(),
    };
    query = `INSERT INTO
    vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
      process.env.AMBIENTE_PROD
    }.TB_ARCHIVOS_FACTURAS
    WITH
    MAXIMO AS (
    SELECT
      MAX(ID_ARCHIVO) AS MAXI
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
        process.env.AMBIENTE_PROD
      }.TB_ARCHIVOS_FACTURAS
      WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}")
  SELECT
    ${maxi + 1} AS ID_ARCHIVO,
    "${archivo.archivo}" AS NOMBRE_ARCHIVO,
    "ACTIVO" AS ESTATUS,
    "gs://vw-vwm-bi-anagp-p-evalpro-l44-archivos-audi-${process.env.AMBIENTE_PROD.toLowerCase()}/${
      req.body.ruta
    }" AS RUTA_STORAGE,
    CAST("${archivo.fecha_y_hora_ingesta}" AS TIMESTAMP) AS FECHA_CARGA,
    "${req.body.user_name || 'TEST'}" AS CARGADO_POR,
    "${process.env.NEXT_PUBLIC_SISTEMA}" AS SISTEMA
    FROM
      MAXIMO`;
    options = {
      query,
      location: 'EU',
    };
    [job] = await bigquery.createQueryJob(options);
    [rows] = await job.getQueryResults();
    res.status(200).json(archivo);
  }
}
