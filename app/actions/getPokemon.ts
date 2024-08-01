"use server"

export async function getPokemon({
  query,
  page = 1,
  limit = 1000
}: {
  query?: string,
  page?: number,
  limit?: number
}) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${(page - 1) * 24}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (query) {
      return data.results
        .filter((pokemon: { name: string }) => pokemon.name.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 24);
    } else {
      return data.results.slice(0, 24);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchPokemon({
  page = 1,
  search
}: {
  page?: number,
  search?: string
}) {
  try {
    return await getPokemon({ query: search, page });
  } catch (error) {
    console.error(error);
    return null;
  }
}
