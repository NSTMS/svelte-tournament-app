import type { PlayerStatus } from "./enums"
export type PlayerType = {
    id: string,
    name : string, 
    surname : string, 
    city : string,
    age : number,
    registerDate : number,
    status: PlayerStatus,
    isEditing? : boolean
}


export type PlayerToAddType = {
    name : string, 
    surname : string, 
    city : string,
    age : number,
}

export type TournamentPair = {
    round : number,
    player_1 : string,
    player_2 : string,
}
