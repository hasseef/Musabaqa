// Patch guide: replace the Wallet view buttons' pending handler with the below
// Example usage snippet (already wired in patch instructions)
import { markInvoicePending } from '../data.js';
import { PAYMENTS } from '../config.payments.js';

async function startProviderPayment(invoiceId, method, amount, title){
  if(PAYMENTS.provider === 'hyperpay'){
    try{
      const res = await fetch(`${PAYMENTS.endpoint.create}?invoiceId=${encodeURIComponent(invoiceId)}&amount=${encodeURIComponent(amount)}&title=${encodeURIComponent(title)}&method=${encodeURIComponent(method)}`, { method: 'POST' });
      if(!res.ok) throw new Error('Failed to create payment');
      const out = await res.json();
      // out.paymentUrl should be a redirect or hosted payment page
      // We still mark as pending and store the provided URL for the user
      markInvoicePending(invoiceId, method);
      // Overwrite link with provider URL (the pending function sets a placeholder; we update it in place)
      const w = JSON.parse(localStorage.getItem('musabaqa_wallet'));
      const i = w.invoices.findIndex(x=>x.id===invoiceId);
      if(i>-1){ w.invoices[i].paymentUrl = out.paymentUrl; localStorage.setItem('musabaqa_wallet', JSON.stringify(w)); }
      alert('تم إنشاء رابط دفع عبر HyperPay');
      location.reload();
      return;
    }catch(e){
      console.error(e);
      alert('تعذر إنشاء جلسة دفع عبر المزود؛ سيتم استخدام رابط تجريبي.');
    }
  }
  // fallback mock
  markInvoicePending(invoiceId, method);
  alert('تم إنشاء رابط دفع تجريبي'); location.reload();
}
