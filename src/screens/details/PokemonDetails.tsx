import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PokemonDetails.css";


const PokemonDetails = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        console.error("Error fetching Pokémon", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading) return <p>Loading...</p>;
  if (!pokemon) return <p>Couldn't find Pokémon.</p>;

  return (
    <div className="main_wrapper">
      <div className="pokemon_details_card">
        <div className="pokeball_watermark" />
        <h1 className="pokemon_heading">
          #{pokemon.id} {pokemon.name}
        </h1>

        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="pokemon_img"
        />

        <div className="pokemon_details_props">
          <div className="pokemon_types">
            {pokemon.types.map((t: any) => (
              <span
                key={t.type.name}
                className={`pokemon_type_badge type-${t.type.name}`}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <p className="pokemon_property">Height: {pokemon.height}</p>
          <p className="pokemon_property">Weight: {pokemon.weight}</p>
        </div>
      </div>

      <button className="back_button" onClick={() => navigate("/")}>
        ⬅ BACK TO POKÉMON LIST
      </button>
    </div>
  );
};

export default PokemonDetails;
