// Cloudflare Worker (optional): same behavior as Netlify function
export default {
  async fetch(request, env, ctx) {
    try{
      const url = new URL(request.url);
      const amount = url.searchParams.get('amount') || '10.00';
      const title = url.searchParams.get('title') || 'Musabaqa Invoice';
      const method = url.searchParams.get('method') || 'CARD';
      const entityId = env.HYPERPAY_ENTITY_ID;
      const bearer = env.HYPERPAY_BEARER;
      if(!entityId || !bearer){
        return new Response(JSON.stringify({ error: 'Missing HyperPay credentials' }), { status: 500 });
      }
      const body = new URLSearchParams({
        'entityId': entityId,
        'amount': String(amount),
        'currency': 'SAR',
        'paymentType': 'DB',
        'merchantTransactionId': String(Date.now()),
        'merchantInvoiceId': String(Date.now()),
        'descriptor': title.slice(0,40),
      });
      const resp = await fetch('https://test.oppwa.com/v1/checkouts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${bearer}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      const data = await resp.json();
      if(!resp.ok){
        return new Response(JSON.stringify({ error: 'HyperPay error', detail: data }), { status: 500 });
      }
      const paymentUrl = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${encodeURIComponent(data.id)}`;
      return new Response(JSON.stringify({ ok: true, paymentUrl, checkoutId: data.id }), { headers: { 'Content-Type': 'application/json' } });
    }catch(err){
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
}