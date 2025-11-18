import { makeAutoObservable } from "mobx"

class Heroes {
    id: number = 0
    icon : string = ""
    health: number = 0
    mana: number = 0
    main_attribute: string = ""
    attack: number = 0
    attack_speed: number = 0
    attack_range: number = 0
    attack_type: string = ""

    constructor() {
        makeAutoObservable(this)
    }

    seticon() {
        this.icon = " "
    }

}

export const _Heroes_ = new Heroes()
