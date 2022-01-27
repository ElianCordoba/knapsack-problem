import { Genetic_Solution } from "../src/core";
import { random_items } from "./random_items";

const solution = new Genetic_Solution({
  items: random_items,
  max_fitness: 9000,
  generation_limit: 100,
  population_size: 200,
  weight_limit: 1000,
  silent: true
})
console.log(solution.run())
