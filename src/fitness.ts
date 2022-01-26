import { Fitness, Genome, Item } from "./types";

export function fitness(items: Item[], weight_limit: number, genome: Genome): [Fitness, number?] {
  if (genome.length !== items.length) {
    throw new Error("Genome and things must be of same length");
  }

  let total_weight = 0;
  let total_value = 0;

  for (let i = 0; i < genome.length; i++) {
    const gene = genome[i];

    if (gene === 0) {
      continue;
    }

    const thing = items[i];
    total_value += thing[1];
    total_weight += thing[2];

    if (total_weight > weight_limit) {
      return [0];
    }
  }

  return [total_value, total_weight];
}