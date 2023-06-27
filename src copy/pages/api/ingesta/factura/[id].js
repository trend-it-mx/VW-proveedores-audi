import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();
const storage = new Storage();

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  const {
    query: { id },
    method,
  } = req;
  if (method === 'GET') {
    res.status(200).json({ id, name: `User ${id}` });
  } else if (method === 'PUT') {
    const archivo = {
      id,
      estatus: req.body.estatus,
      archivo: decodeURI(req.body.archivo),
      fecha_y_hora_ingesta: new Date().toISOString(),
    };

    let query = '';

    if (req.body.reemplazo) {
      query = `UPDATE vw-vwm-bi-anagp-p-evalpro-l44.STG_${
        process.env.AMBIENTE_PROD
      }.TB_ARCHIVOS_FACTURAS SET
    NOMBRE_ARCHIVO = "${archivo.archivo}",
    ESTATUS = "${archivo.estatus}",
    RUTA_STORAGE = "gs://vw-vwm-bi-anagp-p-evalpro-l44-archivos-${process.env.AMBIENTE_PROD.toLowerCase()}/Facturacion/facturacion_${
        process.env.NEXT_PUBLIC_SISTEMA
      }_${id}_${archivo.archivo}}",
    FECHA_CARGA = CAST("${archivo.fecha_y_hora_ingesta}" AS TIMESTAMP)
    WHERE ID_ARCHIVO = ${Number(id)} AND SISTEMA = "${
        process.env.NEXT_PUBLIC_SISTEMA
      }"`;
    } else {
      query = `UPDATE vw-vwm-bi-anagp-p-evalpro-l44.STG_${
        process.env.AMBIENTE_PROD
      }.TB_ARCHIVOS_FACTURAS SET
    ESTATUS = "${archivo.estatus}"
    WHERE ID_ARCHIVO = ${Number(id)} AND SISTEMA = "${
        process.env.NEXT_PUBLIC_SISTEMA
      }"`;
    }

    const [jobUpdate] = await bigquery.createQueryJob({
      query,
      location: 'EU',
    });
    await jobUpdate.getQueryResults();
    res.status(200).json(archivo);
  } else if (req.method === 'DELETE') {
    const query = `
      DELETE
      FROM
        STG_${process.env.AMBIENTE_PROD}.TB_FACTURAS
      WHERE
        ID_ARCHIVO = ${req.query.id}
        AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    `;
    const [job] = await bigquery.createQueryJob({
      query,
      location: 'EU',
    });
    await job.getQueryResults();
    try {
      await storage
        .bucket(
          `vw-vwm-bi-anagp-p-evalpro-l44-archivos-${process.env.AMBIENTE_PROD.toLowerCase()}`
        )
        .file(req.body.rutaArchivo)
        .delete();
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
    res.status(200).json('Eliminado');
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
