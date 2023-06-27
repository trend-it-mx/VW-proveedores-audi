import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  const {
    query: { id },
    body: { rubro, estatus },
    method,
  } = req;
  const idNum = Number(id);
  if (method === 'PUT') {
    const query = `UPDATE vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_RUBROS_WEB SET DESC_RUBRO = "${rubro}", ESTATUS = "${estatus}" WHERE ID_RUBRO = ${idNum} AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    await job.getQueryResults();
    res.status(200).json({ id, rubro, estatus });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
// # sourceMappingURL=%5Bid%5D.js.map
