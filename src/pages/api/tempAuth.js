import { BigQuery } from '@google-cloud/bigquery';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

const bigquery = new BigQuery();
export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  if (req.method === 'GET') {
    const queryPassword = `
    SELECT
      *
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.PasswordPruebas
    WHERE
      password = "${req.query.password}"`;
    const [jobPassword] = await bigquery.createQueryJob({
      query: queryPassword,
      location: 'EU',
    });
    const [rowsPassword] = await jobPassword.getQueryResults();    

    if (rowsPassword.length > 0) {
      const queryUserName = `
      SELECT
      USER_NAME,
      FULL_NAME,
      E_MAIL,
      ROLES
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.TB_USUARIOS_PLATAFORMA
    WHERE
      USER_NAME = '${req.query.userName}'
      AND ESTATUS = "Activo"
      AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    `;
      const [jobUserName] = await bigquery.createQueryJob({
        query: queryUserName,
        location: 'EU',
      });
      const [rowsUserName] = await jobUserName.getQueryResults();

      if (rowsUserName.length > 0) {
        const datosUsuario = {
          user_name: rowsUserName[0].USER_NAME,
          full_name: rowsUserName[0].FULL_NAME,
          e_mail: rowsUserName[0].E_MAIL,
          roles: rowsUserName[0].ROLES,
        };

        res.status(200).json(datosUsuario);
      } else {
        res.status(400).json('Datos incorrectos');
      }
    } else {
      res.status(400).json('Datos incorrectos');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
