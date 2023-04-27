import { db } from "../static/firebase";
import { QueryDocumentSnapshot, collection, getDocs } from "firebase/firestore";
import type { PlayerType } from "../static/types";
import { Players } from "../static/store";

export const getAllData = async () =>{
    await getDocs(collection(db,'players')).then((snap)=>{
      const data: PlayerType[] = snap.docs.map((doc: QueryDocumentSnapshot<PlayerType>)=>{
        return {
          id: doc.id,
          name : doc.data().name, 
          surname : doc.data().surname,
          city : doc.data().city,
          age : doc.data().age,
          registerDate : doc.data().registerDate,
          isEditing : false
        }
      })
      Players.set(data)
      return data
    })
}
    
