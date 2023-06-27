import { Storage } from '@google-cloud/storage';
import NextCors from 'nextjs-cors';
import corsOptions from '@/utils/corsOptions';

export default async function handler(req, res) {
  await NextCors(req, res, corsOptions);
  const storage = new Storage();
  try {
    const bucket = storage.bucket(
      `vw-vwm-bi-anagp-p-evalpro-l44-archivos-${process.env.AMBIENTE_PROD.toLowerCase()}`
    );
    const file = bucket.file(req.query.filePath);
    const options = {
      version: 'v4',
      expires: Date.now() + 1 * 60 * 1000, //  1 minute,
      action: 'write',
    };

    const [response] = await file.getSignedUrl(options);
    res.status(200).json(response);
  } catch {
    res.status(400).json({
      error: 'Error al subir el archivo',
    });
  }
}
