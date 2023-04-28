import { getAllData } from "./getAllData"
import { Players } from "../static/store";
import {get} from "svelte/store"
import type { TournamentPair,PlayerType } from "../static/types";
import { PlayerStatus } from "../static/enums";
import { TournamentPairs } from "../static/store";
export const createTournament =async () =>{
    await getAllData()
    TournamentPairs.set(shuffle(get(Players)))
    const quantity : number = numerOfPlayers()
    
    if(!Number.isInteger(Math.log2(quantity)))
    {
        const power = Math.ceil(Math.log2(quantity))
        for(let i=0;i< Math.pow(2, power)- numerOfPlayers();i++)
        {
            crateBot(i)
            console.log("bot created")
        }
    }

    TournamentPairs.set(get(TournamentPairs).reduce(function(result, _, index, array: PlayerType[]) {
        if (index % 2 === 0)
          result.push(array.slice(index, index + 2));
        return result;
      }, []));
      console.log(get(TournamentPairs));
      
}

const crateBot = (id: number) =>{
    TournamentPairs.set([...get(TournamentPairs),{
        id: 'virtual-player-'+id,
        status : PlayerStatus.Bot,
    }])
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
