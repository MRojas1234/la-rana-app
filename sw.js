// ====================================================================
// EL QUE HACE SONAR EL CELULAR CON LA APP CERRADA
//
// Esto es lo unico que corre cuando La Rana no esta abierta.
//
// NO GUARDA NADA EN CACHE, A PROPOSITO. No tiene manejador de 'fetch'.
// La pagina trae los meta de Cache-Control en no-store desde el 22 de
// octubre, cuando Maria estuvo viendo rutas que ya no existian porque el
// telefono se habia quedado con la version vieja. Un service worker con
// cache vuelve a meter exactamente ese problema, y es peor: su cache
// sobrevive al "recargar". Entre abrir sin senal y abrir la version
// equivocada, se escogio abrir la version buena.
//
// JAVASCRIPT A LA ANTIGUA, igual que el resto de la app: var, function,
// nada de flechas ni async. El de Mi Turno usa sintaxis nueva y ahi si
// esta probado en un telefono de verdad; aqui no se pudo probar en ningun
// telefono todavia, asi que se va por el camino que no se puede caer.
//
// El aviso llega VACIO (ver supabase/functions/rc-push): mandarle texto
// obliga a cifrarlo y es maquinaria que se rompe en silencio. El texto se
// pone aqui, y es a proposito un PUNTERO y no el contenido: existe para que
// abran la app, que es donde ya se ve cual tanda y cuanto se paso. Asi el
// aviso nunca queda desactualizado y cabe en la pantalla de un telefono.
// ====================================================================
var VERSION = 'rana-v67';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (e) {
  e.waitUntil(self.registration.showNotification('Ya se cumplio un reposo', {
    body: 'Una tanda tuya ya termino de reposar. Toca para ver cual.',
    lang: 'es',
    icon: './icono.png',
    badge: './icono.png',
    // Si se vencen dos no se amontonan en la pantalla...
    tag: 'reposo-rana',
    // ...pero cada uno vuelve a sonar.
    renotify: true,
    // No se quita solo: el producto sigue afuera hasta que alguien lo empaque.
    requireInteraction: true,
    vibrate: [300, 120, 300, 120, 500],
    data: { url: './#produccion' }
  }));
});

// Al tocar el aviso: si la app ya esta abierta en algun lado la trae al
// frente; si no, la abre. Las dos van directo a Produccion.
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var destino = (e.notification.data && e.notification.data.url) || './#produccion';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (abiertas) {
        var i, c;
        for (i = 0; i < abiertas.length; i++) {
          c = abiertas[i];
          if (c.url.indexOf(self.registration.scope) === 0) {
            return c.focus().then(function (cc) {
              if (cc && cc.navigate) {
                return cc.navigate(destino)['catch'](function () {});
              }
            });
          }
        }
        return self.clients.openWindow(destino);
      })
  );
});
