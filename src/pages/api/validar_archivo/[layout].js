import { BigQuery } from '@google-cloud/bigquery';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const bigquery = new BigQuery();
  if (req.method === 'POST') {
    const { layout } = req.query;

    const fData = await new Promise((resolve, reject) => {
      const form = new IncomingForm({
        multiples: false,
      });
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        return resolve({ fields, files });
      });
    });

    const { file } = fData.files;
    const temFilePath = file?.filepath;
    if (file.originalFilename.split('.').slice(-1)[0] !== 'csv') {
      res.status(400).json({
        error: 'El archivo no es un csv',
      });
    } else {
      try {
        const queryIgualdad = `
          SELECT
            NOMBRE_ARCHIVO
          FROM
            STG_${process.env.AMBIENTE_PROD}.TB_ARCHIVOS_${layout}
          WHERE
            NOMBRE_ARCHIVO = "${file.originalFilename}"
            AND SISTEMA = "AUDI"
        `;
        const [jobIgualdad] = await bigquery.createQueryJob({
          query: queryIgualdad,
          location: 'EU',
        });
        const [rowsIgualdad] = await jobIgualdad.getQueryResults();

        if (rowsIgualdad[0]) {
          res.status(400).json({
            error: 'Ya existe un archivo con este nombre',
          });
        } else {
          const bufferArchivo = await fs.readFile(temFilePath);
          const dataArchivo = bufferArchivo.toString().split('\n');
          // console.log(dataArchivo[0]);
          const columnasArchivo = dataArchivo[0]
            .trim()
            .toUpperCase()
            .replaceAll(/[^A-Z0-9,]/g, '_')
            .split(',');
          const query = `SELECT
        column_name
      FROM
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${
          process.env.AMBIENTE_PROD
        }.INFORMATION_SCHEMA.COLUMNS
      WHERE
        table_name = "${
          layout === 'USUARIOS' ? 'CAT_USUARIOS' : `TB_${layout}`
        }"
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
          const columnasLayout = rows.map((row) => row.column_name);
          console.log(columnasLayout);
          console.log(columnasLayout.length);
          console.log(columnasArchivo);
          console.log(columnasArchivo.length);

          console.log(
            columnasLayout.filter((v) => columnasArchivo.includes(v))
          );
          console.log(
            columnasLayout.filter((v) => !columnasArchivo.includes(v))
          );
          console.log(
            columnasLayout.map(
              (col, i) =>
                `${col} ${columnasArchivo[i]} ${col === columnasArchivo[i]}`
            )
          );

          console.log(
            columnasArchivo.length === columnasLayout.length &&
              columnasArchivo.every((v, i) => v === columnasLayout[i])
          );

          if (
            columnasArchivo.length === columnasLayout.length &&
            columnasArchivo.every((v, i) => v === columnasLayout[i])
          ) {
            res.status(200).json('Archivo válido');
          } else {
            res.status(400).json({
              error:
                'Las columnas del archivo no coinciden con las establecidas',
            });
          }
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          error: 'Las columnas del archivo no coinciden con las establecidas',
        });
      }
    }
    // const { layout } +txi. = req.query;
    // const columnasArchivo = req.body?.columnas;

    // const columnasLayout = rows.map((row) => row.NOMBRE_CAMPO);

    // let iguales = false;

    // if (columnasArchivo?.length === columnasLayout.length) {
    //   if (
    //     columnasArchivo.every((columna) => columnasLayout.includes(columna))
    //   ) {
    //     iguales = true;
    //   }
    // }

    // res.status(200).json(iguales);
    // res.status(200).json();
    if (temFilePath) {
      await fs.rm(temFilePath);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
