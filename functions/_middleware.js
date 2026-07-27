export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes("ka_pin=2026")) {
    return context.next();
  }

  const pin = url.searchParams.get("pin");
  if (pin === "2026") {
    return new Response(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=/"><title>OK</title></head><body>Access granted.</body></html>',
      {
        status: 200,
        headers: {
          "Content-Type": "text/html;charset=utf-8",
          "Set-Cookie": "ka_pin=2026; Path=/; Max-Age=86400; SameSite=Lax",
        },
      }
    );
  }

  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Kraymer Art Mockup</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1B1815;color:#FAF7F1;font-family:Inter,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center}
.card{background:#FAF7F1;color:#1B1815;border-radius:4px;padding:2rem;max-width:360px;width:90%}
h1{font-family:Fraunces,serif;font-size:1.5rem;margin-bottom:.5rem}
p{font-size:.875rem;color:#6F675C;margin-bottom:1.5rem}
input{width:100%;min-height:48px;padding:0 1rem;border:1px solid #E8E1D5;border-radius:4px;font:inherit;font-size:1.125rem;text-align:center;letter-spacing:.3em}
button{width:100%;min-height:48px;background:#1B1815;color:#FAF7F1;border:0;border-radius:4px;font-size:.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-top:1rem;cursor:pointer}
</style>
</head>
<body>
<form class="card" action="/" method="GET">
<h1>Kraymer Art</h1>
<p>Design mockup — enter PIN.</p>
<input type="password" name="pin" placeholder="····" maxlength="10" autofocus>
<button type="submit">View mockup</button>
</form>
</body>
</html>`,
    { status: 401, headers: { "Content-Type": "text/html;charset=utf-8" } }
  );
}
