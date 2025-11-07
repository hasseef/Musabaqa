
export const storage = {
  read(key, fallback=null){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } },
  write(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
  del(key){ localStorage.removeItem(key); }
};
export const bus = new EventTarget();
