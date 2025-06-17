self.addEventListener('push', (event) => {
  const data = event.data.json();
  // console.log('Push received:', data);

  // Format the reminder time in IST if it exists
  let body = data.body;
  if (data.reminderDate) {
    const date = new Date(data.reminderDate);
    const istTime = date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    body = `${data.body}\nDue: ${istTime}`;
  }

  self.registration.showNotification(data.title, {
    body: body,
    icon: data.icon || '/linkify-logo.png',
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url || '/dashboard'));
});

// Function to format date in IST
function formatISTDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}