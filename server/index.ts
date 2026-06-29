import * as googleTTS from 'google-tts-api';

const PORT = 8000;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Add CORS headers so our frontend can access it
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (req.method === 'OPTIONS') {
      return new Response('OK', { headers });
    }

    if (url.pathname === '/tts') {
      const text = url.searchParams.get('text');
      const lang = url.searchParams.get('lang') || 'en';
      const isSlow = url.searchParams.get('slow') === 'true';

      if (!text) {
        return new Response('Missing text parameter', { status: 400, headers });
      }

      try {
        // google-tts-api securely fetches the audio buffer from Google 
        // with the correct 'tk' token bypassing 403 blocks.
        const base64Audio = await googleTTS.getAudioBase64(text, {
          lang: lang,
          slow: isSlow,
          host: 'https://translate.google.com',
          timeout: 10000,
        });

        // Convert base64 to binary ArrayBuffer
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        return new Response(bytes.buffer, {
          headers: {
            ...headers,
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      } catch (error) {
        console.error('TTS error:', error);
        return new Response('TTS Generation Failed', { status: 500, headers });
      }
    }

    return new Response('Not Found', { status: 404, headers });
  }
});

console.log(`Backend running at http://localhost:${PORT}`);
