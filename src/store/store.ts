import { makeAutoObservable } from "mobx"
import { buttonpress } from '../ui_interact/leftpanelbutton'
export type Match = {
    id: number
    result: "W" | "L"
    hero: string
    time: string
}

class DotaAPIMap {
    heroMap: Record<number, string> | null = null
    winAndLossMap: { win: number, loss: number } = { win: 0, loss: 0 }
}

class PlayerStatisticDota2API {
    nickname: string = "Player123"
    wins: number = 0
    losses: number = 0
    recent: string = "WWLLWLLWWL"
    matches: Match[] = [
        { id: 1, result: "W", hero: "Juggernaut", time: "2h" },
        { id: 2, result: "W", hero: "Pudge", time: "5h" },
        { id: 3, result: "L", hero: "Axe", time: "1d" },
        { id: 4, result: "L", hero: "Invoker", time: "2d" },
        { id: 5, result: "W", hero: "Пидор", time: "3d" },
        { id: 6, result: "L", hero: "Sniper", time: "4d" },
    ]
    matchespage: number = 0
    avatar: string = ""

    constructor() {
        makeAutoObservable(this)
    }

    matchesPage(next: boolean) {
        if (next) {
            this.matchespage += 1
        } else if (this.matchespage > 0) {
            this.matchespage -= 1
        }
    }

    setAvatar(avatarUrl: string) {
        this.avatar = avatarUrl
    }

    loadNickname(nick: string) {
        this.nickname = nick
    }

    setStats(wins: number, losses: number, recent?: string) {
        this.wins = wins
        this.losses = losses
        if (recent !== undefined) this.recent = recent
    }

    setMatches(matches: Match[]) {
        this.matches = matches.slice()
    }

    addMatch(match: Match) {
        this.matches.unshift(match)
    }

    latest(nu: number): Match[] {
        return this.matches.slice(0 + (5 * nu), 5 + (nu * 5))
    }
}


class LeftPanel {
    activeTab: string = "1"

    constructor() {
        this.activeTab = "1"
        makeAutoObservable(this)
    }

    setActiveTab(tab: string) {
        this.activeTab = tab
        buttonpress(this.activeTab)
    }
}

export const _PlayerStatisticDota2API_ = new PlayerStatisticDota2API()
export const _DotaAPIMap_ = new DotaAPIMap()
export const _LeftPanel_ = new LeftPanel()