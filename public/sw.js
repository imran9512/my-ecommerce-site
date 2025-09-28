// empty SW → 204, no warning
self.addEventListener('activate', () => self.clients.claim());