# Knapsack problem

This is tool models and tackles the [Knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem), an [NP complexity](https://en.wikipedia.org/wiki/NP_(complexity)) problem. It's well documented so you can easily read the code and understand how it works under the hood.

## Credits
I got inspired by this great [video](https://www.youtube.com/watch?v=uQj5UNhCPuo&t=0s) by Kia Codes. This repository started as a rewrite of the code used in that video series (found [here](https://github.com/kiecodes/genetic-algorithms)), moving it from Python to Typescript. After the initial port was done I decided to add my touch to adapt it to my own coding style.

# Usage

```bash
  # Simplest configuration, with all default options.
  # Uses:
  # - Single gene mutation with 50% chance of mutating the gene
  # - Single point crossover function
  npm run example-1

  # Run the tests in watch mode
  npm run test
```

## Knapsack problem overview

You have a bag with a maximum weight of things it can carry. You also have a list of items with a given value and weight, your task is to come up with a list of items whose weight combined does not exceed the maximum weight and has the maximum value.

## Functionality overview

> tl;dr of how this genetic algorithm works

1. Create a `population`, an array of `genomes`, which itself it's just a bitmap, an array of 1 or 0, used to identify if the given item it's included or not

```javascript
const population = [
  [ 0, 0, 1 ], // Genome 1 = Item index 2 included
  [ 1, 0, 1 ]  // Genome 2 = Items indexes 0 & 2 included
  [ 1, 1, 0 ]  // Genome 3 = Items indexes 0 & 1 included
];
```

2. Begin iterating until you hit the `generation_limit` or, if provided, until you hit the `max_fitness`. You need one of these criteria otherwise the simulation would run forever

3. Sort the population by `fitness`, it's a measurement of how well the `genome` performs at the given task, in this case, the more total value you can carry without exceeding the weight limit the more `fitness` you will have.

4. Take the fittest N `genomes` and put them into the next generation.

5. Take two `genomes` in a weighted random choice*

6. Apply a [crossover](https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)#Examples) (See One-point crossover
 for the simples example) function to those `genomes`

7. Apply a mutation (see the `gene_mutation` function as an example) to both the `genomes` and push them to the next generation

8. Repeat this process (jumping to step 5) until you have the desired number of `genomes` in the `next_population`

9. Once the stop criteria, defined in step 2, is reached, sort the population one last time by fitness and return the fittest `genome`, that's your solution



\* A weighed choice means that you randomly choose elements in a list assigning them different probabilities of being selected, for example:

```
  Element 1 = weight 70 = 70%
  Element 2 = weight 20 = 20%
  Element 3 = weigth 10 = 10%
```