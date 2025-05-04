import React, { useEffect, useState } from "react";
import { getPokemonData } from "../api/pokemonData";
import axios from "axios";
import LoaderImg from '../assets/loader.svg';

export const Home = () => {
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPokemonData();
                const pokemonDetails = await Promise.all(
                    data.map(async (pokemon) => {
                        const response = await axios.get(pokemon.url);
                        const { id, name, types, sprites } = response.data;
                        return {
                            id,
                            name,
                            types: types.map((type) => type.type.name),
                            image: sprites.front_default,
                        };
                    })
                );
                setPokemons(pokemonDetails);
                setFilteredPokemons(pokemonDetails);
            } catch (err) {
                setError(`Error Please try again later`);
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = pokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(search.toLowerCase()) &&
            (typeFilter === "all" || pokemon.types.includes(typeFilter))
        );
        setFilteredPokemons(filtered);
    }, [search, typeFilter, pokemons]);

    //Loading Handler
    if (loading) return (
        <div className="flex items-center justify-center w-full h-[70vh]">
            <img
                src={LoaderImg}
                alt="Loading..."
                className="w-[15%]">
            </img>
        </div>
    );

    //Error Handler
    if (error) return (
        <p className="flex items-center justify-center w-full h-[70vh]">{error}</p>
    );

    return (
        <main className="px-3 max-w-[1600px] w-[85%] mx-auto">
            <div className="flex mx-auto my-3 gap-1 flex-col sm:flex-row">
                <input

                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search Pokemon name...'
                    className='border grow-1 border-yellow-500 px-5 py-3 rounded-full focus:outline-none'
                />

                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className='px-2 py-2 basis-[25%] border border-yellow-500 rounded-full focus:outline-none'
                >
                    <option value="all">All Types</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="grass">Grass</option>
                    <option value="poison">Poison</option>
                    <option value="flying">Flying</option>
                </select>
            </div>

            <div className="flex flex-wrap gap-3 justify-around">
                {filteredPokemons.map((pokemon) => (
                    <div key={pokemon.id}
                        className="flex basis-[100%] sm:basis-[30%] justify-center items-center gap-2 border border-gray-300 rounded py-3 shadow-xl cursor-pointer transition-scale duration-300 hover:scale-[.98]">
                        <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="w-[30%] rounded-full border border-yellow-200 shadow-xl"
                        />

                        <div className="flex flex-col items-center justify-center gap-3">
                        <span className="text-yellow-600">{pokemon.name.toUpperCase()}</span>
                        <div className="flex gap-1">
                            {pokemon.types.map((type) => (
                                <span key={type} className="px-2 py-1 text-xs bg-gray-100 rounded">{type}</span>
                            ))}
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};
