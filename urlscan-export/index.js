const checks = await Deno.readTextFile("checks.txt");

let list = [];

const run = async (check, last) => {
  const params = new URLSearchParams();
  params.append("q", check);
  if (last) params.append("search_after", last);

  const response = await fetch(`https://urlscan.io/api/v1/search?${params}`);
  const { results } = await response.json();
  list.push(...results);
  if (results.length === 100) await run(check, results.at(-1).sort.join(","));
};

for (const check of checks.split("\n")) {
  await run(check);
}

console.log(`Found ${list.length} results`);
await Deno.writeTextFile("results.json", JSON.stringify(list));
