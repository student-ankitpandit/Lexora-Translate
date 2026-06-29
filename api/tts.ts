import * as googleTTS from 'google-tts-api';

export default async function handler(req: any, res: any) {
  // CORS Headers (allow any origin since this will be an API route)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { text, lang, slow } = req.query;

    if (!text || typeof text !== 'string') {
      return res.status(400).send('Missing text parameter');
    }

    const langCode = typeof lang === 'string' ? lang : 'en';
    const isSlow = slow === 'true';

    // Fetch the base64 encoded audio string from Google TTS
    const base64Audio = await googleTTS.getAudioBase64(text, {
      lang: langCode,
      slow: isSlow,
      host: 'https://translate.google.com',
    });

    // Convert the base64 string directly to a Buffer
    const buffer = Buffer.from(base64Audio, 'base64');

    // Send the binary audio file back
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(buffer);

  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({ 
      error: 'TTS Generation Failed', 
      details: error.message || error.toString() 
    });
  }
}
