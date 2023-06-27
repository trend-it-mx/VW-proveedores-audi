import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `CALL STG_${process.env.AMBIENTE_PROD}.SP_LIMPIEZA();`;
    const options = {
      query,
      location: 'EU',
    };
    try {
      const [job] = await bigquery.createQueryJob(options);
      const [rows] = await job.getQueryResults();
      res.status(200).json(rows);
    } catch (e) {
      res.status(400).json(e);
    }
  }
}
