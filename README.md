# ZeReact Neubrutalist — Live BotWA API

## Deploy ke Netlify
1. Upload/push seluruh isi folder ini ke GitHub.
2. Netlify settings:
   - Branch: `main`
   - Base directory: kosong
   - Build command: kosong
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
3. Tambahkan Environment Variable:
   - Key: `BOTWA_API_KEY`
   - Value: API key dari `react.botwa.net`
   - Centang **Contains secret values**.
4. Deploy ulang.

API key tidak ditaruh di frontend. Frontend memanggil `/.netlify/functions/react`, lalu fungsi server meneruskan request ke `https://react.botwa.net/api/react`.

Catatan: gunakan hanya pada channel dan sesuai ketentuan layanan API. Maksimal 5 emoji per permintaan pada antarmuka ini.
