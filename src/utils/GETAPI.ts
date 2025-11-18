import { _DotaAPIMap_ } from '../store/store'
import type { Match } from '../store/store'
import { formatTime, sleep } from './misc'


let DotaAPIMap = _DotaAPIMap_


//Загрузка всех героев
export const loadHeroMap = async () => {

  if (DotaAPIMap.heroMap) return DotaAPIMap.heroMap
  const res = await fetch('https://api.opendota.com/api/heroes/')
  if (!res.ok) throw new Error(`Failed to load heroes: ${res.status}`)
  const data = await res.json()
  DotaAPIMap.heroMap = {}
  for (const h of data) {
    DotaAPIMap.heroMap[h.id] = h.localized_name
  }
  return DotaAPIMap.heroMap
}

//Информация о играх игрока
export const getAllMatches = async (playerId: string): Promise<Match[]> => {
  const url = `https://api.opendota.com/api/players/${playerId}/matches`
  const maxRetries = 3
  let attempt = 0
  let lastErr: any = null

  while (attempt < maxRetries) {
    attempt++
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format from matches API')
      }

      const map = await loadHeroMap().catch(() => ({} as Record<number,string>))

      const matches: Match[] = data.map((match: any) => {
        const result: 'W' | 'L' = ((match.player_slot < 128) === match.radiant_win) ? 'W' : 'L'
        const m: Match = {
          id: match.match_id,
          result,
          hero: map[match.hero_id] ?? String(match.hero_id),
          time: formatTime(match.start_time)
        }
        return m
      })

      return matches
    }

    lastErr = new Error(`Fetch matches failed: ${response.status}`)
    if (response.status === 429) {
      const wait = 500 * Math.pow(2, attempt - 1)
      console.warn(`Rate limited by API (429). Retry #${attempt} after ${wait}ms`)
      await sleep(wait)
      continue
    } else {
      throw lastErr
    }
  }
  throw lastErr || new Error('Failed to fetch matches')
}

export const loadwinandloss = async (playerId: string) => {
  console.log("pizda")
  const res = await fetch(`https://api.opendota.com/api/players/${playerId}/wl`)
  console.log("suka")
  if (!res.ok) console.log(Error(`Failed to load win/loss data: ${res.status}`))
  console.log("zalupa")
  const data = await res.json()
  console.log("huy")
  DotaAPIMap.winAndLossMap = {
    win: data.win,
    loss: data.lose
  }
  console.log(DotaAPIMap.winAndLossMap)
  return DotaAPIMap.winAndLossMap
}

export const loadAvatar = async (playerId: string) => {
  const res = await fetch(`https://api.opendota.com/api/players/${playerId}`)
  if (!res.ok) throw new Error(`Failed to load avatar: ${res.status}`)
  const data = await res.json()
  return data.profile.avatarfull
}

export const loadNickname = async (playerId: string) => {
  const res = await fetch(`https://api.opendota.com/api/players/${playerId}`)
  if (!res.ok) throw new Error(`Failed to load nickname: ${res.status}`)
  const data = await res.json()
  return data.profile.personaname
}