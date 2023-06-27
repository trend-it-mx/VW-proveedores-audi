import { BigQuery } from '@google-cloud/bigquery';

const actualizarRubros = async () => {
  const bigquery = new BigQuery();

  const querySi = `
    UPDATE
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_RUBROS_WEB
    SET
      EN_USO = "SI"
    WHERE
      ID_RUBRO IN 
    (
      SELECT
        DISTINCT
          TEMPLATES.ID_RUBRO
      FROM
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_RUBROS_WEB RUBROS
      RIGHT JOIN
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB TEMPLATES
      ON
        RUBROS.ID_RUBRO = TEMPLATES.ID_RUBRO
      WHERE
        TEMPLATES.ESTATUS = "Activa"
        AND TEMPLATES.SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    )
    AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    `;
  const options = {
    querySi,
    location: 'EU',
  };
  const [jobSi] = await bigquery.createQueryJob(options);
  await jobSi.getQueryResults();

  const queryNo = `
  UPDATE
    vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_RUBROS_WEB
  SET
    EN_USO = "NO"
  WHERE
    ID_RUBRO IN 
  (
    SELECT
      DISTINCT
        RUBROS.ID_RUBRO
    FROM
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_RUBROS_WEB RUBROS
    LEFT JOIN
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB TEMPLATES
    ON
      RUBROS.ID_RUBRO = TEMPLATES.ID_RUBRO
    WHERE
      TEMPLATES.ID_RUBRO IS NULL
      OR TEMPLATES.ESTATUS != "Activa"
      AND TEMPLATES.SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
  )
  AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    `;
  const [jobNo] = await bigquery.createQueryJob({
    queryNo,
    location: 'EU',
  });
  await jobNo.getQueryResults();
};

export default actualizarRubros;
