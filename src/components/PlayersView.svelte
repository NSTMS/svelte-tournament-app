<script lang="ts">
  import { onMount } from "svelte";
  import { link, navigate,Link } from "svelte-routing";
  import { Players } from "../static/store";
  import { getAllData,searchPhrase } from "../functions/functions";

  import Player from "./Player.svelte";
  import EditingPlayer from "./EditingPlayer.svelte";
    import type { PlayerType } from "../static/types";
  let isLoading: boolean = true;
  let searchTerm : string = ""
  let selected: string = ""


  onMount(async () => {
    await getAllData()
    isLoading = false;
  });

  const onSearch = async () =>{
    const req : PlayerType[] = searchPhrase(searchTerm,selected)
    if(req) Players.set(req)
    else{
      isLoading = true;
      await getAllData()
      isLoading = false;
    }

  }

</script>

<a class="link add-link" href="/add" use:link>add new player</a>
<a class="link" href="/tournament" use:link>see tournament</a>

{#if isLoading}
  <p>Loading data...</p>
{:else}
  <div class="search-bar-section">
    <div>
      <select name="field" id="field" bind:value={selected}>
        <option value=""></option>
        <option value="id">id</option>
        <option value="name">name</option>
        <option value="surname">surname</option>
        <option value="age">age</option>
        <option value="city">city</option>
      </select>
      <input type="text" name="search" id="search" bind:value={searchTerm}>
      <button on:click={onSearch}>search</button>
    </div>
    <button on:click={()=> window.location.reload()}>clear</button>
  </div>

  <table>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>surname</th>
      <th>age</th>
      <th>city</th>
    </tr>
    {#each $Players as player}
      {#await player}
        <p>Loading player data...</p>
      {:then playerData}
      {#if playerData.status == 0}
        {#if playerData.isEditing}
          <EditingPlayer player={playerData} />
        {:else}
          <Player player={playerData} />
        {/if}
      {/if}
      {/await}
    {/each}
  </table>
{/if}
