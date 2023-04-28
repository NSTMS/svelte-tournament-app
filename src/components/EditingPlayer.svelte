<script lang="ts">
    import type { PlayerType } from "../static/types";
    export let player : PlayerType;
    import { changePlayersEditingStatus, updatePlayer,getAllData,getPlayer } from "../functions/functions";

    let name : string = player.name
    let surname : string = player.surname
    let age : number = player.age
    let city : string = player.city

    const handleCancelClick = () =>{
        changePlayersEditingStatus(player.id)
    }
    const handleSubmitClick = async () =>{
        const restorePlayer = await getPlayer(player.id)
        await updatePlayer(player.id, {
            ...restorePlayer,
            name : name,
            surname : surname, 
            age : age, 
            city : city
        })
        changePlayersEditingStatus(player.id)
        getAllData()
    }

</script>


<tr class="player-card">
    <td>{player.id}</td>
    <td><input type="text" bind:value={name}></td>
    <td><input type="text" bind:value={surname}></td>
    <td><input type="number" bind:value={age}></td>
    <td><input type="text" bind:value={city}></td>
    <td><button on:click={handleSubmitClick} class="button submit-button">submit</button></td>
    <td><button on:click={handleCancelClick} class="button cancel-button"> x </button></td>
</tr>