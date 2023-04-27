<script lang="ts">
    import { onMount } from "svelte";
    import { getTournamentTree } from "../functions/functions";
    onMount(getTournamentTree)
</script>
