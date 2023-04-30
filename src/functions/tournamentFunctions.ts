import { getAllData } from "./getAllData"
import { Players } from "../static/store";
import {get} from "svelte/store"
import type { PlayerType, TournamentPair } from "../static/types";
import { TournamentStatus } from "../static/enums";
import { TournamentPairs,Tournament } from "../static/store";
import type TournamentHallView from "../components/TournamentHallView.svelte";
let playersWaitingForFirstGame : PlayerType[] = []
export const createTournament =async (name : string, winPrize : number ) =>{
    await getAllData()
    playersWaitingForFirstGame = get(Players)
    TournamentPairs.set(shuffle(get(Players)))
    const q : number = numerOfPlayers()
    let rounds = []

    let numberOfRounds : number = Math.ceil(Math.log2(q))

    let closestPowerOfTwo : number = Math.pow(2, Math.ceil(Math.log2(q)))
    let playersInFirstRound : number = closestPowerOfTwo - 2*(closestPowerOfTwo-q)

    let iterator =  Math.pow(2, Math.ceil(Math.log2(q)-1))
    for(let i=0;i<numberOfRounds;i++) 
    {
        rounds.push([])
        if(i == 0)
        {
            for(let j=0;j<playersInFirstRound/2;j++)
             rounds[i].push([
                {
                    round : i+1,
                    players : [
                        drawAndRemoveFromWaitingPlayers(),
                        drawAndRemoveFromWaitingPlayers(),
                    ],
                    isCurrentRound: true
                }
            ])
        }
        else{
            for(let j=0;j<iterator;j++) rounds[i].push([
                {
                    round : i+1,
                    players : [
                        drawAndRemoveFromWaitingPlayers(),
                        drawAndRemoveFromWaitingPlayers(),
                    ],
                    isCurrentRound : false,
                    
                }
            ])
        }
        iterator = iterator/ 2
    }
    
    Tournament.set({
        name : name,
        status: TournamentStatus.Created,
        numberOfRounds : numberOfRounds,
        numberOfPlayers : q,
        rounds : rounds, 
        overallScore : 0,
        winPrize :  winPrize,
        winner : null,
        currentRound : 0,
    })
    
    console.log("Ilu graczy: ", q)
    console.log("Ile rund: ", numberOfRounds)
    console.log("Najbliższa potęga 2: ", closestPowerOfTwo)
    console.log("Ilu graczy w eliminacjach: ", playersInFirstRound)      
}

export const changeTournamentRound = () =>{
    if(get(Tournament).currentRound == 1) Tournament.update(tournament => ({...tournament, status : TournamentStatus.InProgress }));

    let round = get(Tournament).rounds[get(Tournament).currentRound]
    
    round.forEach((r : Array<TournamentPair>) =>{
        r.forEach((rr : TournamentPair) =>{
            let bestPlayer : PlayerType = null
            let bestScore : number = 0
            rr.players.forEach((s : PlayerType) => {
                if(s.score >= bestScore) 
                {
                    bestScore = s.score
                    bestPlayer = s
                }
            })
            let blankFieldsInNextRound = get(Tournament).rounds[get(Tournament).currentRound+1]
        
            blankFieldsInNextRound.forEach((r : Array<TournamentPair>) =>{
                r.forEach((rr : TournamentPair) =>{
                    rr.players.forEach((s : PlayerType) => {
                        if(s == undefined)
                        {
                            s = bestPlayer
                            let rounds = get(Tournament).rounds
                            rounds[get(Tournament).currentRound+1] =blankFieldsInNextRound
                            Tournament.update(tournament => ({...tournament, rounds: rounds }));
                        }
                    })
                })
            })
        })
    })

    

    Tournament.update(tournament => ({ ...tournament, currentRound: tournament.currentRound + 1 }));
    if(get(Tournament).currentRound >= get(Tournament).numberOfRounds){

        const winner = get(Players)[Math.floor(Math.random()* get(Players).length)]
        console.log(winner)
        Tournament.update(tournament => ({...tournament, status : TournamentStatus.Finished, winner : winner.id }));
    }
}

const drawAndRemoveFromWaitingPlayers = () : PlayerType =>{
    let player : PlayerType = playersWaitingForFirstGame[Math.floor(Math.random() * playersWaitingForFirstGame.length)]
    playersWaitingForFirstGame = playersWaitingForFirstGame.filter(p => p.id !== player.id)
    return player
}


const shuffle = (arr: PlayerType[]) : PlayerType[] =>{
    const shuffled = arr.slice();
    const n = shuffled.length;
    const swap = (array: PlayerType[], i: number, j: number) => {
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    for (let i = 0; i < n; i++) 
        swap(shuffled, i, Math.floor(Math.random() * n));
    return shuffled;
}

const numerOfPlayers = (): number  => {
    return get(Players).length
}

export const getPlayerById = (id : string) : string =>{
    const player = get(Players).find(p => p.id === id)
    return (player)?`${player.name} ${player.surname}` : ""
}
