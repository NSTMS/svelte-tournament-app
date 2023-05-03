import { getAllData } from "./getAllData"
import { Players } from "../static/store";
import {get} from "svelte/store"
import type { PlayerType, TournamentPair } from "../static/types";
import { TournamentStatus } from "../static/enums";
import { TournamentPairs,Tournament } from "../static/store";
let playersWaitingForFirstGame : PlayerType[] = []
export const createTournament =async (name : string, winPrize : number ) =>{
    await getAllData()
    playersWaitingForFirstGame = get(Players)
    TournamentPairs.set(shuffle(get(Players)))
    const q : number = get(Players).length
    let rounds = []
    let numberOfRounds : number = Math.ceil(Math.log2(q))

    let closestPowerOfTwo : number = Math.pow(2, Math.ceil(Math.log2(q)))
    let playersInFirstRound : number = closestPowerOfTwo - 2*(closestPowerOfTwo-q)

    let iterator = Math.pow(2, Math.ceil(Math.log2(q)-1))
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
    
    // console.log("Ilu graczy: ", q)
    // console.log("Ile rund: ", numberOfRounds)
    // console.log("Najbliższa potęga 2: ", closestPowerOfTwo)
    // console.log("Ilu graczy w eliminacjach: ", playersInFirstRound)      
    // console.log("Drzewko: ", get(Tournament).rounds)
}

const getWinnerFromPair = (players :  PlayerType[]) =>{
    if(players[0].score == players[1].score) return null; // handle draw?
    else if(players[0].score > players[1].score) return players[0]
    else return players[1]
}

export const changeTournamentRound = () =>{
    const currentRound : number = get(Tournament).currentRound
    Tournament.update(tournament => ({...tournament, status : TournamentStatus.InProgress }));
    if(currentRound == get(Tournament).numberOfRounds-1)
    {
        const winner = getWinnerFromPair(get(Tournament).rounds[get(Tournament).currentRound][0][0].players)
        Tournament.update(tournament => ({...tournament, status : TournamentStatus.Finished, winner : winner.id }));
        return;
    } 
    
    const gamesInCurrentRound  : TournamentPair[][] = get(Tournament).rounds[currentRound]
    let roundWinners : PlayerType[] = []
        gamesInCurrentRound.forEach((matches: TournamentPair[]) => {
        matches.forEach((match: TournamentPair) => {
            const winner = getWinnerFromPair(match.players)
            if(winner == null) Tournament.update(tournament => ({ ...tournament, status : TournamentStatus.IncorrectlyFilled }));
            else roundWinners.push(getWinnerFromPair(match.players))
        });
    });      

    if(get(Tournament).status == TournamentStatus.IncorrectlyFilled) return;
    
    let gamesInNextRound : TournamentPair[][] = get(Tournament).rounds[currentRound+1]
    gamesInNextRound.forEach((matches: TournamentPair[]) => {
        matches.forEach((match: TournamentPair) => {
          match.players.forEach((player: PlayerType, index: number) => {
            if (!player) {
              match.players[index] = {...roundWinners.shift(),  score: 0};
            }
          });
        });
      });
      
    let rounds = get(Tournament).rounds
    rounds[currentRound + 1] = [...gamesInNextRound]    
    Tournament.update(tournament => ({ ...tournament, currentRound: tournament.currentRound + 1, rounds }));
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

export const getPlayerById = (id : string) : string =>{
    const player = get(Players).find(p => p.id === id)
    return (player)?`${player.name} ${player.surname}` : ""
}
