<script lang="ts">
  import { onMount } from "svelte";
  import { link } from "svelte-routing";
  import { Players } from "../static/store";
  import { getAllData } from "../functions/getAllData";

  import Player from "./Player.svelte";
  import EditingPlayer from "./EditingPlayer.svelte";
  let isLoading: boolean = true;

  onMount(async () => {
    await getAllData().then(() => {
      isLoading = false;
    });
  });
</script>

<a class="link add-link" href="/add" use:link>add new player</a>
<a class="link" href="/tournament" use:link>see tournament</a>

{#if isLoading}
  <p>Loading data...</p>
{:else}
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
        {#if playerData.isEditing}
          <EditingPlayer player={playerData} />
        {:else}
          <Player player={playerData} />
        {/if}
      {/await}
    {/each}
  </table>
{/if}
