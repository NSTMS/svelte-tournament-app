<script lang="ts">
    import type { PlayerType } from "../static/types";
    import { deletePlayer,changePlayersEditingStatus,getAllData } from "../functions/functions";
    export let player : PlayerType;

    const handleEditClick = () =>{
        changePlayersEditingStatus(player.id)
    }
    const handleDeleteClick = async () =>{
       await deletePlayer(player.id).then(()=>{
        getAllData()
       })
    }

</script>


<tr class="player-card">
    <td>{player.id}</td>
    <td>{player.name}</td>
    <td>{player.surname}</td>
    <td>{player.age}</td>
    <td>{player.city}</td>
    <td><button on:click={handleEditClick} class="button edit-button">edit</button></td>
    <td><button on:click={handleDeleteClick} class="button delete-button ">delete</button></td>
</tr>