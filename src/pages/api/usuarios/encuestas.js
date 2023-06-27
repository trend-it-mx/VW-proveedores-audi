import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();

export default async function userHandler(req, res) {
  await NextCors(req, res, corsOptions);
  const { method } = req;
  if (method === 'GET') {
    const query = `
    SELECT
      ID_REGISTRO,
      ORDEN_COMPRA,
      PROVEEDOR,
      FECHA_GENERADA,
      ESTATUS
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_ENCUESTAS_ENCABEZADO
    WHERE
      USUARIO_ENCUESTADO = "${req.query.usuario}"
      AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    ORDER BY
      ID_REGISTRO
    `;
    const options = {
      query,
      location: 'EU',
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    res.status(200).json(
      rows.map((row) => ({
        ...row,
        FECHA_GENERADA: row.FECHA_GENERADA.value,
      }))
    );
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
// # sourceMappingURL=%5Bid%5D.js.map
