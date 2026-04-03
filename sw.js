self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('goodday').then(cache => {
      return cache.addAll(['./'])
    })
  )
})