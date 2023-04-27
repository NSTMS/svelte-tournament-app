import type { PlayerType } from "../static/types";
import { writable, type Writable } from "svelte/store";
export const Players : Writable<PlayerType[]> = writable([])
