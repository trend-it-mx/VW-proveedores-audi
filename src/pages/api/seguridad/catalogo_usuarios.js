import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const query = `SELECT
    CAT.USER_NAME,
    CONCAT(CAT.FIRST_NAME, " ", CAT.LAST_NAME) AS FULL_NAME,
    CAT.E_MAIL_ADDRESS AS E_MAIL
  FROM
    vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.CAT_USUARIOS CAT
  LEFT JOIN
    vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.TB_USUARIOS_PLATAFORMA PLAT
  ON
    CAT.USER_NAME = PLAT.USER_NAME
  WHERE
    PLAT.USER_NAME IS NULL
    AND CAT.SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
  ORDER BY
    USER_NAME DESC`;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows);
  }
}
