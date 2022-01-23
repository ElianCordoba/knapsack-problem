import { expect, test } from "vitest";

import { get_random_bit, get_random_number_in_range, create_array, generate_genome } from "../src/utils";

test("get_random_bit", () => {
  expect(get_random_bit()).oneOf([0, 1]);
});

test("get_random_number_in_range", () => {
  expect(get_random_number_in_range(5, 10))
    .greaterThanOrEqual(5)
    .lessThanOrEqual(10);
});

test("create_array", () => {
  expect(create_array(5, () => 1))
    .instanceOf(Array)
    .length(5);
});

test("generate_genome", () => {
  expect(generate_genome(5)).instanceOf(Array).length(5);

  expect(only_one_or_zero(generate_genome(5))).toBe(true);
});

// Matcher function
function only_one_or_zero(array: any[]) {
  const other_numbers_in_array = array.some((x) => x !== 0 && x !== 1);

  return !other_numbers_in_array;
}

test("only_one_or_zero", () => {
  expect(only_one_or_zero([0, 1, 0])).toBe(true);
  expect(only_one_or_zero([0, 1, 2])).toBe(false);
});
