self.addEventListener('push', event => {
  let payload;
  try { payload = event.data?.json(); } catch { return; }
  if (!/^[a-z0-9_-]{1,80}$/i.test(payload?.clientId ?? '')) return;
  event.waitUntil(self.registration.showNotification(payload.time ? 'Звонок · ' + payload.time : 'Пора позвонить', {
    body: 'Открыть карточку',
    tag: typeof payload.tag === 'string' ? payload.tag : undefined,
    data: { clientId: payload.clientId },
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const clientId = event.notification.data?.clientId;
  if (!/^[a-z0-9_-]{1,80}$/i.test(clientId ?? '')) return;
  const url = new URL('./', self.registration.scope);
  url.hash = 'client=' + clientId;
  event.waitUntil(self.clients.openWindow(url.href));
});
