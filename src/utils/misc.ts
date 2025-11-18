export function formatTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  
  if (diff < 3600) return Math.floor(diff / 60) + "m"
  if (diff < 86400) return Math.floor(diff / 3600) + "h"
  return Math.floor(diff / 86400) + "d"
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}