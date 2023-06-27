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
    const query = `SELECT MENSAJE, TIPO_MENSAJE FROM vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.TB_MENSAJES_ENCUESTADO WHERE ID_USUARIO = "${id}" AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}" ORDER BY ID_MENSAJE DESC`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
// # sourceMappingURL=%5Bid%5D.js.map
