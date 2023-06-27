import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  const {
    query: { id },
    body: { pregunta, estatus },
    method,
  } = req;
  if (method === 'GET') {
    res.status(200).json({ id, name: `User ${id}` });
  } else if (method === 'PUT') {
    const query = `UPDATE vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PREGUNTAS_WEB SET DESC_PREGUNTA = "${pregunta}", ESTATUS = "${estatus}" WHERE ID_PREGUNTA = "${id} AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}""`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    await job.getQueryResults();
    res.status(200).json({ id, pregunta, estatus });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
// # sourceMappingURL=%5Bid%5D.js.map
