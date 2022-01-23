export type Item = [name: string, value: number, weight: number];

export type Gene = 0 | 1;
// Essentially a bitmap
export type Genome = Gene[];
export type Population = Genome[];

export type Fitness = number;

/**
 * To simplify the use of the fitness function, we apply the first two arguments so that when we use it in the solution instance we
 * don't need to pass them.
 * Because of this, we need a different type for the function that gets pass during the initialization of the solution
 */
// 

export type FitnessFn = (items: Item[], weight_limit: number, genome: Genome,) => Fitness;
export type PartiallyAppliedFitnessFn = (genome: Genome) => Fitness;

export type SelectionFn = (population: Population) => [Genome, Genome];
export type CrossoverFn = (
  genomeA: Genome,
  genomeB: Genome,
  pre_defined_point?: number // For testing
) => [Genome, Genome];
export type MutationFn = (genome: Genome) => Genome;

export interface Options {
  items: Item[];
  weight_limit: number;
  generation_limit: number;

  max_fitness?: number;
  selection_fn?: SelectionFn;
  crossover_fn?: CrossoverFn;
  mutation_fn?: MutationFn;
}