
export function fmtDate(d){ const dt = new Date(d); return dt.toLocaleDateString('ar-SA', { year:'numeric', month:'short', day:'2-digit'}); }
export function uid(){ return Math.random().toString(36).slice(2); }
export function downloadFile(filename, text){
  const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
