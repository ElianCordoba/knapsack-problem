import { fitness } from './fitness';
import { CrossoverFn, Fitness, FitnessFn, Gene, Genome, Item, MutationFn, Options, PartiallyAppliedFitnessFn, Population, SelectionFn } from './types'
import { create_array, generate_genome, genome_to_string, get_random_number_in_range, last_item_from_array, range, weighted_selection } from './utils';

export class Genetic_Solution {
  items: Item[];
  weight_limit: number;
  generation_limit: number;
  fitness_fn: PartiallyAppliedFitnessFn;

  max_fitness?: number;
  selection_fn: SelectionFn;
  crossover_fn: CrossoverFn;
  mutation_fn: MutationFn;

  constructor({
    // Required options
    items,
    weight_limit,
    generation_limit,

    // Optional options
    max_fitness,
    selection_fn,
    crossover_fn,
    mutation_fn,
  }: Options) {
    this.items = items;
    this.weight_limit = weight_limit;
    this.generation_limit = generation_limit || 100;

    this.fitness_fn = fitness.bind(this, this.items, this.weight_limit);

    this.max_fitness = max_fitness;
    this.selection_fn = selection_fn || this.selection_pair;
    this.crossover_fn = crossover_fn || this.single_point_crossover;
    this.mutation_fn = mutation_fn || this.gene_mutation;
  }

  run(): [Genome, Fitness] {
    // TODO population size option
    let population = this.generate_population(10, this.items.length);

    let i = 0;

    for (let _ of range(this.generation_limit)) {
      population = this.sort_population(population);

      this.print_stats(population, i);

      // If max_fitness is present and we matched or exceed it, return early
      if (this.max_fitness && this.max_fitness <= this.fitness_fn(population[0])) {
        return [population[0], i]
      }

      const next_generation = population.slice(0, 2);

      const iterations = Math.floor(population.length / 2) - 1

      // while (next_generation.length <= 10 // population size)
      for (let _ of range(iterations)) {
        const parents = this.selection_fn(population);
        let [offspring_a, offspring_b] = this.crossover_fn(
          parents[0],
          parents[1]
        );
        offspring_a = this.mutation_fn(offspring_a);
        offspring_b = this.mutation_fn(offspring_b);
        next_generation.push(offspring_a, offspring_b);
      }

      population = next_generation;

      i++;
    }

    return [this.sort_population(population)[0], i];
  }

  // Genetic functions

  gene_mutation(
    genome: Genome,
    probability: number = 0.5,
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

  /**
   * Performs a single point crossover between two genomes (https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)#Examples)
   * Given:
   *  genome_a: aaaaaaaa
   *  genome_b: bbbbbbbb
   *
   *  crossover_point: 3
   *
   *  genome_a: aaabbbbb
   *  genome_b: bbbaaaaa
   *
   *  Note: the predefined_crossover_point argument is used for testing
   */
  single_point_crossover(
    a: Genome,
    b: Genome,
    predefined_crossover_point?: number
  ): [Genome, Genome] {
    if (a.length !== b.length) {
      throw new Error("Genomes a and b must be of same length");
    }

    // Hot path, we need the genomes to be longer than one gene to crossover them
    if (a.length === 1) {
      return [a, b];
    }

    // A crossover point of 0 is would result in A being B and B being A, that's why we get a random number from 1
    const crossover_point =
      predefined_crossover_point || get_random_number_in_range(1, a.length);

    const new_a = [...a.slice(0, crossover_point), ...b.slice(crossover_point)];
    const new_b = [...b.slice(0, crossover_point), ...a.slice(crossover_point)];

    return [new_a, new_b];
  }

  selection_pair(
    population: Population
  ) {
    const fitness = population.map(x => this.fitness_fn(x));

    return weighted_selection(
      population,
      fitness,
      2
    ) as unknown as [Genome, Genome];
  };

  generate_population(
    size: number,
    genome_length: number
  ): Population {
    return create_array(size, () => generate_genome(genome_length));
  }

  // Other functions

  sort_population(population: Population): Population {
    const results = population.map((genome) => ({
      genome,
      fitness: this.fitness_fn(genome),
    }));

    const sorted_result = results.sort((a, b) =>
      a.fitness < b.fitness ? 1 : -1
    );

    return sorted_result.map((x) => x.genome);
  }

  population_fitness(population: Population): Fitness {
    let fitness = 0;
    population.map((genome) => (fitness += this.fitness_fn(genome)));

    return fitness;
  }

  print_stats(population: Population, generation_id: number) {
    console.log(`GENERATION ${generation_id}`);
    console.log("=============");
    console.log(`Population: ${population.map(genome_to_string)}`);
    console.log(
      `Avg. Fitness: ${this.population_fitness(population) / population.length}`
    );

    const sorted_population = this.sort_population(population);

    const best_genome = sorted_population[0];
    const worst_genome = last_item_from_array(sorted_population);

    // TODO: Instead of recalculating the fitness you can return it from the sort_population function
    console.log(
      `Best: ${genome_to_string(best_genome)} {${this.fitness_fn(best_genome)})`
    );
    console.log(
      `Worst: ${genome_to_string(worst_genome)} (${this.fitness_fn(
        worst_genome
      )})`
    );

    console.log("");
  }
}
