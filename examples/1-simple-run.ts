import { Genetic_Solution } from "../src/core";
import { items } from "./_items";

const solution = new Genetic_Solution({ items, generation_limit: 50, weight_limit: 1000 })

console.log(solution.run())