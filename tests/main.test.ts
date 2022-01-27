import { expect, test } from "vitest";
import { Genetic_Solution } from "../src/core";
import { fitness } from "../src/fitness";
import { Genome, Item, Population } from "../src/types";

import { items } from "../examples/_items";

const WEIGHT_LIMIT = 1000;

const solution = new Genetic_Solution({ items, generation_limit: 100, weight_limit: WEIGHT_LIMIT })

test("generate_population", () => {
  const population = solution.generate_population(5, 3)

  expect(population).instanceOf(Array).length(5);
  expect(population[0]).instanceOf(Array).length(3);
});

test.only("single_point_crossover", () => {
  const a = 'aaaaaa' as any
  const b = 'bbbbbb' as any

  // The 1 means we guarantee the crossover
  const [new_a, new_b] = solution.single_point_crossover(a, b, 1, 3);

  expect(new_a.length).toBe(a.length)
  expect(new_b.length).toBe(b.length)

  expect(new_a.join('')).toBe('aaabbb')
  expect(new_b.join('')).toBe('bbbaaa')
});

test("population_fitness", () => {
  const items: Item[] = [
    ['a', 10, 5],
    ['b', 2, 1],
    ['c', 3, 4],
  ];

  const population: Population = [
    [0, 1, 0],
    [0, 1, 1],
    [1, 1, 1],
  ]

  const simplified_solution = new Genetic_Solution({ items, weight_limit: 10, generation_limit: 10 })

  expect(simplified_solution.population_fitness(population)).toBe(22);
});

test("fitness_fn", () => {
  const genome: Genome = [1, 0, 0, 1, 1];
  const max_weigth = 10;
  const items: Item[] = [
    ['a', 10, 5],
    ['b', 2, 1],
    ['c', 3, 4],
    ['d', 7, 4],
    ['e', 4, 1]
  ]

  expect(fitness(items, max_weigth, genome)).toBe(21);
});
