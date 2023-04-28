<script lang="ts">
    import { onMount } from "svelte";
    import { createTournament } from "../functions/functions";
    import { PlayerStatus } from "../static/enums";
    import { TournamentPairs } from "../static/store";
    onMount(()=>{
        createTournament()        
    })
</script>
<a class="link add-button" href="/" use:link>back to main page</a>
    
<main>
    {#each $TournamentPairs  as pair}
        <br>
        {#each pair as member}
            <div class="tournament-pair">
                {#if member.status == PlayerStatus.Player}
                    <div class="member">
                        <span>{member.name} {member.surname}</span>
                    </div>
                {:else}
                    <div class="bot">
                        <span>{member.id}</span>
                    </div>
                {/if}
            </div>
        {/each}
    {/each}
</main>

