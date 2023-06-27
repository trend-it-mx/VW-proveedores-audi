import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `SELECT
    column_name
  FROM
    vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
      process.env.AMBIENTE_PROD
    }.INFORMATION_SCHEMA.COLUMNS
  WHERE
    table_name = '${
      req.query.tabla === 'USUARIOS' ? 'CAT_USUARIOS' : `TB_${req.query.tabla}`
    }'
    AND column_name != "SISTEMA"
    AND column_name != "ID_ARCHIVO"
  ORDER BY
    ordinal_position ASC`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows.map((row) => row.column_name));
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
// import { BigQuery } from '@google-cloud/bigquery';

// const bigquery = new BigQuery();
// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const query = `SELECT * FROM vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.LAY_${req.query.tabla} WHERE SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}" ORDER BY NOMBRE_CAMPO`;
//     const options = {
//       query,
//       location: 'EU',
//     };
//     const [job] = await bigquery.createQueryJob(options);
//     const [rows] = await job.getQueryResults();
//     res.status(200).json(rows);
//   } else if (req.method === 'POST') {
//     const { campos } = req.body;
//     const camposFormateados = campos.reduce((acum, campo, idx) => {
//       const campoFormateado = `STRUCT("${campo.nombre}" AS NOMBRE_CAMPO, "${campo.desc}" AS DESCRIPCION, ${campo.nulos} AS ADMISION_NULOS)`;
//       return `${acum}${idx === 0 ? '' : ',\n'}${campoFormateado}`;
//     }, '');

//     const query = `
//     CREATE OR REPLACE TABLE
//   vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.LAY_${req.query.tabla} AS (
//   SELECT
//     NOMBRE_CAMPO,
//     DESCRIPCION,
//     ADMISION_NULOS,
//     "${process.env.NEXT_PUBLIC_SISTEMA}" AS SISTEMA
//   FROM
//     UNNEST(
//       [
//         ${camposFormateados}
//       ]
//     )
//   )
//     `;
//     const options = {
//       query,
//       location: 'EU',
//     };
//     const [job] = await bigquery.createQueryJob(options);
//     const [rows] = await job.getQueryResults();
//     res.status(200).json(rows);
//   }
// }
