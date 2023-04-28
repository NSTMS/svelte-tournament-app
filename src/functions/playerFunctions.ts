import type { PlayerToAddType } from "../static/types"
import { Players } from "../static/store"
import { db } from "../static/firebase"
import { deleteDoc,doc,setDoc,getDoc } from "firebase/firestore"
import { PlayerStatus } from "../static/enums"


export const getPlayer = async(id: string) =>{
    const docRef = doc(db, "players", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export const deletePlayer = async (id: string) => {
    await deleteDoc(doc(db, "players", id)).catch((error)=>{
        console.error("Error adding document: ", error);
    })
}
export const changePlayersEditingStatus = (id: string) => {
    Players.update(players => {
        const player = players.find(player => player.id === id)
        player.isEditing = !player.isEditing
        return players
    })
}

export const updatePlayer = async (id: string,player : PlayerToAddType) => {
    await setDoc(doc(db, "players", id),{
        ...player,
    }).catch((error)=>{
        console.error("Error updating document: ", error);
    })
}


export const addPlayer = async (player : PlayerToAddType) => {
    const id = Date.now().toString()
    await setDoc(doc(db, "players", id),{
        ...player,
        registerDate : id,
        status: PlayerStatus.Player
    }).catch((error)=>{
        console.error("Error adding document: ", error);
    })
}