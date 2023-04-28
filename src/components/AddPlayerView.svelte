<script lang="ts">
    import { link,navigate} from "svelte-routing";
    import { addPlayer,getAllData } from "../functions/functions"; 

    let name : string = null
    let surname : string = null
    let age : number = null
    let city : string = null

    const handleSubmitClick = async () =>{
        if(name == null || surname == null || age == null || city == null) return;
        await addPlayer({
            name : name,
            surname : surname, 
            age : age, 
            city : city
        }).then(()=>{
            getAllData()
            navigate("/")
        })
    }
    
</script>


<a class="link add-button" href="/" use:link>back to main page</a>
<td><input type="text" bind:value={name} placeholder="name"></td>
<td><input type="text" bind:value={surname} placeholder="surname"></td>
<td><input type="number" bind:value={age} placeholder="age"></td>
<td><input type="text" bind:value={city} placeholder="city"></td>
<td><button on:click={handleSubmitClick} class="button submit-button">submit</button></td>