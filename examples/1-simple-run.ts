import { Genetic_Solution } from "../src/core";
import { Item } from "../src/types";

export const items: Item[] = [
  ["Laptop", 500, 2200],
  ["Headphones", 150, 160],
  ["Coffee Mug", 60, 350],
  ["Notepad", 40, 333],
  ["Water Bottle", 30, 192],
  ["Mints", 5, 25],
  ["Socks", 10, 38],
  ["Tissues", 15, 80],
  ["Phone", 500, 200],
  ["Baseball Cap", 100, 70],
];

const solution = new Genetic_Solution({ items, generation_limit: 10, weight_limit: 1000 })

console.log(solution.run())