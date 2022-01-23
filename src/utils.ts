import select from "weighted";
import { Genome } from "./types";

// Todo: Use Typed arrays?
export function create_array<T>(length: number, fillerFn: () => T) {
  return Array.from({ length }, fillerFn);
}

export function get_random_bit() {
  return Math.random() > 0.5 ? 1 : 0;
}

export function get_random_number_in_range(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function genome_to_string(genome: Genome) {
  return genome.join("");
}

export function generate_genome(length: number): Genome {
  return create_array(length, get_random_bit);
}

// Gives you one or more items from a list randomely selected, weighed and without duplicates.
// Note: The list should be of unique elements
export function weighted_selection<T extends any[]>(
  _items: T,
  _weights: number[],
  number_of_results = 1
) {
  const items = [..._items];
  const weights = [..._weights];
  const results: T[] = [];

  while (results.length < number_of_results) {
    const candidate_result = select(items, weights);
    const index_of_candidate_result = results.indexOf(candidate_result);

    // If there is an index then the it's a new result
    if (index_of_candidate_result === -1) {
      results.push(candidate_result);

      // Take the selected item and associated weight out of the list so that next iteration yields a different result
      const index_of_item = items.indexOf(candidate_result);

      items.splice(index_of_item, 1);
      weights.splice(index_of_item, 1);
    }
  }

  return results;
}

export function last_item_from_array<T extends any[]>(items: T) {
  return items[items.length - 1];
}

export function* range(limit: number) {
  let x = 0;

  while (x < limit - 1) {
    yield (x += 1);
  }
}