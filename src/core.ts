import { fitness } from './fitness';
import { CrossoverFn, Gene, Genome, Item, MutationFn, Options, PartiallyAppliedFitnessFn, Population, SelectionFn } from './types'
import { create_array, generate_genome, genome_to_string, get_random_number_in_range, last_item_from_array, range, weighted_selection } from './utils';

export class Genetic_Solution {
  items: Item[];
  weight_limit: number;
  generation_limit: number;
  fitness_fn: PartiallyAppliedFitnessFn;

  population_size: number;
  max_fitness?: number;
  selection_fn: SelectionFn;
  crossover_fn: CrossoverFn;
  mutation_fn: MutationFn;

  silent: boolean;

  constructor({
    // Required options
    items,
    weight_limit,
    generation_limit,

    // Optional options
    population_size,
    max_fitness,
    selection_fn,
    crossover_fn,
    mutation_fn,

    // Misc
    silent
  }: Options) {
    this.items = items;
    this.weight_limit = weight_limit;
    this.generation_limit = generation_limit || 100;

    this.fitness_fn = fitness.bind(this, this.items, this.weight_limit);

    this.max_fitness = max_fitness;
    this.population_size = population_size || 500;
    this.selection_fn = selection_fn || this.selection_pair;
    this.crossover_fn = crossover_fn || this.single_point_crossover;
    this.mutation_fn = mutation_fn || this.gene_mutation;

    this.silent = silent || false
  }

  run() {
    let population = this.generate_population(this.population_size, this.items.length);

    let i = 0;

    for (let _ of range(this.generation_limit)) {
      population = this.sort_population(population);

      if (!this.silent) {
        this.print_stats(population, i);
      }

      // If max_fitness is present and we matched or exceed it, return early
      if (this.max_fitness) {
        const current_max_fitness = this.fitness_fn(population[0]).fitness;

        if (this.max_fitness <= current_max_fitness) {
          break;
        }

      }

      // Elitism
      const next_generation = population.slice(0, 2);

      while (next_generation.length <= this.population_size) {
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

    const best_genome = this.sort_population(population)[0]

    return {
      best_genome,
      fitness: this.fitness_fn(best_genome).fitness,
      number_of_generations: i
    }
  }

  // Genetic functions

  gene_mutation(
    genome: Genome,
    probability: number = 0.5,
    iterations: number = 1
  ): Genome {
    const genome_copy = [...genome];

    for (let _ of range(iterations)) {
      const will_mutate = probability > Math.random();

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
    probability: number = 0.5,
    predefined_crossover_point?: number
  ): [Genome, Genome] {
    if (a.length !== b.length) {
      throw new Error("Genomes a and b must be of same length");
    }

    // Hot path, we need the genomes to be longer than one gene to crossover them
    if (a.length === 1) {
      return [a, b];
    }

    const will_crossover = probability > Math.random();

    if (!will_crossover) {
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
    // We add a random value to the fitness, we need at least two genomes with actual fitness (exceeding the max_weigth retulst in 0 fitness) to pass to the selection function
    const fitness = population.map(x => this.fitness_fn(x).fitness + Math.random());

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
      fitness: this.fitness_fn(genome).fitness,
    }));

    const sorted_result = results.sort((a, b) =>
      a.fitness < b.fitness ? 1 : -1
    );

    return sorted_result.map((x) => x.genome);
  }

  population_fitness(population: Population) {
    let fitness = 0;
    population.map((genome) => (fitness += this.fitness_fn(genome).fitness));

    return fitness;
  }


  print_stats(population: Population, generation_id: number) {
    console.log(`GENERATION ${generation_id}`);
    console.log("=============");
    // console.log("Population:");
    // console.log(population.map(genome_to_string).join("\n"))
    console.log(
      `Avg. Fitness: ${(this.population_fitness(population) / population.length).toFixed(2)}`
    );

    const sorted_population = this.sort_population(population);

    const best_genome = sorted_population[0];
    const worst_genome = last_item_from_array(sorted_population);

    const { fitness: best_fitness, weigth: best_weigth } = this.fitness_fn(best_genome)
    const { fitness: worst_fitness, weigth: worst_weigth } = this.fitness_fn(worst_genome)

    // TODO: Instead of recalculating the fitness you can return it from the sort_population function
    console.log(
      `Best: ${genome_to_string(best_genome).padEnd(population.length + 5)}`
    );
    console.log(`fitness: ${String(best_fitness).padEnd(8)} | weigth: ${best_weigth}`)

    console.log(
      `Worst: ${genome_to_string(worst_genome).padEnd(population.length + 5)}`
    );
    console.log(`fitness: ${String(worst_fitness).padEnd(8)} | weigth: ${worst_weigth}`)

    console.log("");
  }
}
