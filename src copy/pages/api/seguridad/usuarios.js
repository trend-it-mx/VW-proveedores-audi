import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `SELECT USER_NAME, FULL_NAME, E_MAIL, ROLES, ESTATUS FROM vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.TB_USUARIOS_PLATAFORMA WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}" ORDER BY USER_NAME DESC`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    const query = `INSERT INTO
    vw-vwm-bi-anagp-p-evalpro-l44.STG_${
      process.env.AMBIENTE_PROD
    }.TB_USUARIOS_PLATAFORMA
  SELECT
    "${req.body.usuario}" AS USER_NAME,
    "${req.body.nombre}" AS FULL_NAME,
    "${req.body.correo_electronico}" AS E_MAIL,
    CURRENT_TIMESTAMP() AS CREATED_ON,
    "${req.body.user_name || 'TEST'}" AS AGREGADO_POR,
    "Activo" AS ESTATUS,
    "${process.env.NEXT_PUBLIC_SISTEMA}" AS SISTEMA,
    [${req.body.roles.map((rol) => `"${rol}"`)}] AS ROLES`;
    console.log(query);
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    await job.getQueryResults();
    res.status(200).json({
      usuario: req.body.usuario,
    });
  }
}
