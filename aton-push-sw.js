self.addEventListener('push', event => {
  let payload;
  try { payload = event.data?.json(); } catch { return; }
  if (!/^[a-z0-9_-]{1,80}$/i.test(payload?.clientId ?? '')) return;
  const name = typeof payload.name === 'string' ? payload.name.replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,' ').replace(/\s+/g,' ').trim().slice(0,80) : '';
  event.waitUntil(self.registration.showNotification(payload.time ? 'Звонок · ' + payload.time : 'Пора позвонить', {
    body: name || 'Открыть карточку',
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
