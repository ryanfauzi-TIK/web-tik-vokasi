export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Cloudflare-Pages-Function'
    },
    body: JSON.stringify({
      client_id: context.env.GITHUB_CLIENT_ID,
      client_secret: context.env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return new Response(`OAuth Error: ${data.error_description}`, { status: 400 });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head><title>Otorisasi Sukses</title></head>
    <body>
      <p>Menghubungkan ke panel admin...</p>
      <script>
        const receiveMessage = (e) => {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      </script>
    </body>
    </html>
  `;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}