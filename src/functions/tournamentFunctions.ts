import { getAllData } from "./getAllData"
import { Players } from "../static/store";
import {get} from "svelte/store"
export const getTournamentTree = async () =>{
    await getAllData().then(()=>{
        console.log(get(Players))
        
    
    })
}


// jesli nieparzytsa to wylkosuj jedną osobe i póxniej zrob pair dla pozostałych a tego przenieś do drugiej rundy
// jesli patrzysta zrob pair dla wszytskich