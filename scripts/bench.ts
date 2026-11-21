const N = 1_000_000;
const list: string[] = [];
const set = new Set<string>();

for (let i = 0; i < N; i++) {
  const key = `1-S${i}`;
  list.push(key);
  set.add(key);
}

const missing = "1-FREE";

console.time("array .some");
list.some((k) => k === missing);
console.timeEnd("array .some");

console.time("set .has");
set.has(missing);
console.timeEnd("set .has");