import { BigQuery } from '@google-cloud/bigquery';

const actualizarPreguntas = async () => {
  const bigquery = new BigQuery();

  const querySi = `
    UPDATE
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PREGUNTAS_WEB
    SET
      EN_USO = "SI"
    WHERE
      ID_PREGUNTA IN 
    (
      SELECT
        DISTINCT
          CAST(TEMPLATES.ID_PREGUNTA AS STRING)
      FROM
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PREGUNTAS_WEB PREGUNTAS
      RIGHT JOIN
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB TEMPLATES
      ON
        PREGUNTAS.ID_PREGUNTA = CAST(TEMPLATES.ID_PREGUNTA AS STRING)
      WHERE
        TEMPLATES.ESTATUS = "Activa"
        AND TEMPLATES.SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    )
    AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
    `;
  const [jobSi] = await bigquery.createQueryJob({
    querySi,
    location: 'EU',
  });
  await jobSi.getQueryResults();

  const queryNo = `
    UPDATE
      vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PREGUNTAS_WEB
    SET
      EN_USO = "NO"
    WHERE
      ID_PREGUNTA IN 
    (
      SELECT
        DISTINCT
          CAST(PREGUNTAS.ID_PREGUNTA AS STRING)
      FROM
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_PREGUNTAS_WEB PREGUNTAS
      LEFT JOIN
        vw-vwm-bi-anagp-p-evalpro-l44.STG_AUDI_${process.env.AMBIENTE_PROD}.CAT_TEMPLATES_ENCUESTA_WEB TEMPLATES
      ON
        PREGUNTAS.ID_PREGUNTA = CAST(TEMPLATES.ID_PREGUNTA AS STRING)
      WHERE
        TEMPLATES.ID_PREGUNTA IS NULL
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

export default actualizarPreguntas;
