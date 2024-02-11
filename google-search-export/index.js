const list = []
const checks = (await Deno.readTextFile("./checks.txt")).split("\n")

const apiKey = Deno.env.get("API_KEY")
const engineID = Deno.env.get("ENGINE_ID")

const search = async (query, page = 0) => {
    const params = new URLSearchParams({
        key: apiKey,
        cx: engineID,
        start: `${page * 10}`,
        safe: "off",
        q: `"${query}"`,
        filter: "0",
        num: "10"
    })

    const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`)
    const json = await response.json();

    if (json.items) {
        list.push(...json.items)
        if (json.items.length >= 10) await search(query, page+1)
    }
}


for (const check of checks) {
    await search(check)
}
await Deno.writeTextFile("./results.json", JSON.stringify(list))