<script lang="ts">
  import { onMount } from "svelte";
  import { createTournament,changeTournamentRound,getPlayerById } from "../functions/functions";
  import { Tournament } from "../static/store";
  import { link } from "svelte-routing";
  let isLoading = true;
  onMount(async () => {
    await createTournament("nowy", 10000);
    isLoading = false;
  });

  const handleRoundSubmit = () =>{
    changeTournamentRound()
  }

</script>

<a class="link add-button" href="/" use:link>back to main page</a>

{#if isLoading}
<p>Loading data...</p>
{:else}
{#key $Tournament}
  <h1>{$Tournament.name}</h1>
  <h2>{$Tournament.status}</h2>
  <main class="tournament-view" style="--columns:{$Tournament.rounds.length};">
      {#each $Tournament.rounds as round,i}
        <div class="round-games">
          {#each round as game}
            <div class="tournament-game">
              <h2>{game[0].round}</h2>
              <div class="tournament-game-players">
                {#each game[0].players as player}
                {#if player}
                <div class="member">
                  <span>{player.name} {player.surname}</span>
                  <input type="number" name="score"  min="0"  id="score" disabled={$Tournament.currentRound !== i} bind:value={player.score}/>
                </div>
                {:else}
                  <div class="member">
                      <input type="number" disabled>
                  </div>  
                {/if}
                  {/each}
              </div>
          </div>
          {/each}
          {#if $Tournament.currentRound == i}
              <button on:click={handleRoundSubmit}>submit round {i+1}</button>
          {/if}
        </div>
      {/each}
  </main>
  {#if getPlayerById($Tournament.winner)}
    <h2>winner : {getPlayerById($Tournament.winner)}</h2>
  {/if}
{/key}
{/if}

<style>
    .tournament-view {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(var(--columns), 1fr);
        margin:20px;
    }
    button {
        width:120px;
        height:40px;
        margin:auto;
        cursor: pointer;

    }
    .round-games {
        display: grid;
        gap:10px;

    }
    .tournament-game {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        padding: 20px;
        grid-template-columns: repeat(2, 1fr);
        border: 2px solid black;
    }
  
</style>
