import { useEffect, useState } from "react";
import Image from "next/image";
import Type from "./Type";

export interface Pokemon {
  url: string;
  name: string;
}

interface Ability {
  ability: {
    name: string;
  };
}

interface PokemonData {
  height: number;
  weight: number;
  abilities: Ability[];
  types: { type: { name: string } }[];
}

interface Props {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<Props> = ({ pokemon }) => {
  const [data, setData] = useState<PokemonData | null>(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const fetchedData: PokemonData = await response.json();
        setData(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPokemonData();
  }, [pokemon.url]);

  const getPokemonNumberFromUrl = (url: string): string | null => {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : null;
  };

  const pokemonNumber = getPokemonNumberFromUrl(pokemon.url);

  const formatMeasurement = (value: number, unit: string): string => `${value} ${unit}`;

  const getGlowColor = (types: { type: { name: string } }[]): string => {
    const typeGlowColors: { [key: string]: string } = {
      fire: "rgba(255, 0, 0, 0.5)",
      water: "rgba(0, 0, 255, 0.5)",
      electric: "rgba(255, 255, 0, 0.5)",
      grass: "rgba(0, 255, 0, 0.5)",
      poison: "rgba(128, 0, 128, 0.5)",
    };
    return types.length > 0 ? typeGlowColors[types[0].type.name] || "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.5)";
  };

  const cardStyles = `bg-gray-800 flex flex-col items-center rounded-lg p-4 shadow-lg ${getGlowColor(data?.types || [])}`;
  const infoStyles = "bg-blue-900 px-4 py-2 rounded-lg text-white mt-2";

  return (
    <div className="flex items-center justify-center flex-col relative">
      <div className={cardStyles}>
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonNumber}.png`}
          width={300}
          height={300}
          alt="pokemon image"
          className="z-[9999] rounded-lg"
        />
        {data && (
          <div className="flex flex-col items-center mt-4">
            <p className={infoStyles}>
              Height: {formatMeasurement(data.height / 10, "meters")}
            </p>
            <p className={infoStyles}>
              Weight: {formatMeasurement(data.weight / 10, "kg")}
            </p>
            <div className="flex flex-col text-center mt-2">
              <h3 className="font-bold text-xl underline">Abilities</h3>
              {data.abilities.map((ability, index) => (
                <span key={index}>{ability.ability.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <span className="font-bold px-2 py-1 rounded-lg my-5 uppercase text-white bg-blue-900">{pokemon.name}</span>
      <div className="flex gap-2">
        {data?.types?.map((type, index) => (
          <Type key={index} typeName={type.type.name as "fire" | "grass" | "water" | "electric" | "poison"} />
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;
