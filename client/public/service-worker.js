self.addEventListener('push', (event) => {
  const data = event.data.json();
  // console.log('Push received:', data);

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/linkify-logo.png',
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url || '/dashboard'));
}); 