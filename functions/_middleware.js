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
<title>Kraymer</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#181514;color:#FCF8F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:1.5rem}
.card{width:100%;max-width:340px}
h1{font-family:'Times New Roman',Georgia,serif;font-size:1.75rem;font-weight:400;letter-spacing:-.02em;margin-bottom:.35rem}
p{font-size:.875rem;color:#A09892;margin-bottom:2rem;line-height:1.4}
input{display:block;width:100%;height:54px;padding:0 1rem;background:transparent;border:1px solid #3D3839;border-radius:8px;color:#FCF8F7;font-size:1.25rem;letter-spacing:.4em;text-align:center;font-family:Georgia,serif;caret-color:#C4A882;outline:none}
input:focus{border-color:#C4A882}
button{display:block;width:100%;height:54px;margin-top:1rem;background:#FCF8F7;color:#181514;border:0;border-radius:8px;font-size:.8125rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}
button:active{opacity:.7}
input::placeholder{color:#5C5551;letter-spacing:.1em;font-size:.875rem;font-family:inherit}
.logo{font-family:'Times New Roman',Georgia,serif;font-size:.75rem;color:#C4A882;letter-spacing:.12em;text-transform:uppercase;margin-bottom:3rem}
</style>
</head>
<body>
<div class="card">
<div class="logo">Kraymer</div>
<h1>Enter PIN</h1>
<p>Design mockup &middot; internal only</p>
<form action="/" method="GET">
<input type="password" name="pin" placeholder="&middot;&middot;&middot;&middot;" maxlength="10" autofocus>
<button type="submit">View</button>
</form>
</div>
</body>
</html>`,
    { status: 401, headers: { "Content-Type": "text/html;charset=utf-8" } }
  );
}
