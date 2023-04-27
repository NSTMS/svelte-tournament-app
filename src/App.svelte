<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "./static/firebase";
  import { QueryDocumentSnapshot, collection, getDocs } from "firebase/firestore";
  import { writable, type Writable } from "svelte/store";
  import type { Player } from "./static/types";

 const Players : Writable<Player[]> = writable([])
  onMount(()=>{
      loadDocs()
    })

    const loadDocs = () =>{
      getDocs(collection(db,'tasks')).then((snap)=>{
        const data: Player[] = snap.docs.map((doc: QueryDocumentSnapshot<Player>)=>{
          return {
            id: doc.id,
            name : doc.data().name, 
            surname : doc.data().surname,
            city : doc.data().city,
            age : doc.data().age,
            registerDate : doc.data().registerDate,
            isEdit : false
          }
        })
        Players.set(data)
      })
    }
    
</script>

<main>        
  {#each $Players as player}
  {/each}
</main>
