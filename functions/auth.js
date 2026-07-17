export async function onRequest(context) {
  const url = new URL(context.request.url);
  const client_id = context.env.GITHUB_CLIENT_ID;
  
  const redirect_uri = `${url.origin}/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize` +
    `?client_id=${client_id}` +
    `&scope=repo,user` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    
  return Response.redirect(githubAuthUrl, 302);
}