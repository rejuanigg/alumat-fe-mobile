// Corta la espera si el servicio no responde (conexiones lentas o caídas).
// Rechaza con { code } para que cada servicio lo traduzca a su categoría.
export const withTimeout = (promise, ms, code = 'timeout') =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject({ code }), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
