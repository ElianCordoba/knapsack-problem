import { Genetic_Solution } from "../src/core";
import { Genome, Gene } from "../src/types";
import { range, get_random_number_in_range } from "../src/utils";
import { random_items } from "./random_items";

// Copied from core.ts
function gene_mutation(
  genome: Genome,
  probability: number = 0.90,
  iterations: number = 1
): Genome {
  const genome_copy = [...genome];

  for (let _ of range(iterations)) {
    const will_mutate = Math.random() > probability;

    if (!will_mutate) {
      continue;
    }

    const bit_to_modify = get_random_number_in_range(0, genome.length);

    // Flip the bit
    genome_copy[bit_to_modify] = (genome_copy[bit_to_modify] ^ 1) as Gene;
  }

  return genome_copy;
}

const solution = new Genetic_Solution({
  items: random_items,
  max_fitness: 9000,
  generation_limit: 100,
  population_size: 200,
  weight_limit: 1000,
  mutation_fn: gene_mutation,
  silent: true
})
console.log(solution.run())
