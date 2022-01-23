import { Fitness, Genome, Item } from "./types";

export function fitness(items: Item[], weight_limit: number, genome: Genome): Fitness {
  if (genome.length !== items.length) {
    throw new Error("Genome and things must be of same length");
  }

  let weight = 0;
  let value = 0;

  for (let i = 0; i < genome.length; i++) {
    const gene = genome[i];

    if (gene === 0) {
      continue;
    }

    const thing = items[i];
    value += thing[1];
    weight += thing[2];

    if (weight > weight_limit) {
      return 0;
    }
  }

  return value;
}