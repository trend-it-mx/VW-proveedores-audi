import axios from 'axios';
import { config } from './constants';

// export const eliminar = async (rutaArchivo) => {
//   await axios.delete(
//     `${config.url.API_URL}/api/eliminar_archivo_gcs?rutaArchivo=${rutaArchivo}`
//   );
// };
export const eliminar = async () => {
  // const deleteOptions = {
  //   ifGenerationMatch: generationMatchPrecondition,
  // };
  // async function deleteFile() {
  //   await storage
  //     .bucket(
  //       `vw-vwm-bi-anagp-p-evalpro-l44-archivos-audi-${process.env.AMBIENTE_PROD.toLowerCase()}`
  //     )
  //     .file(fileName)
  //     .delete(deleteOptions);
  //   console.log(`gs://${bucketName}/${fileName} deleted`);
  // }
  // deleteFile().catch(console.error);
};

export const subir = async (formData, rutaArchivo) => {
  const res = await axios.get(
    `${config.url.API_URL}/api/generar_url_firmada?filePath=${rutaArchivo}`
  );
  const url = res.data;
  await axios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
