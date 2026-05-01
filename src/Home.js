import { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [SelectedType, setSelectedType] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState("");

  // Load favorites from localStorage
  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("fav")) || [];
    setFavorites(fav);
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page}`
    );
    const data = await res.json();

    const details = await Promise.all(
      data.results.map(async (p) => {
        const res = await fetch(p.url);
        return res.json();
      })
    );

    setPokemon(details);
  };

  // Toggle favorite
  const toggleFav = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("fav", JSON.stringify(updated));
  };

  

  const filtered = pokemon.filter((p) => {
  const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

  const matchType = SelectedType
    ? p.types.some((t) => t.type.name === SelectedType)
    : true;

  return matchSearch && matchType;
});

  return (
    <div className="container">
      <h1 className="title">POKEDEX-LITE</h1>

      <input
        className="search"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="filter"
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
        <option value="electric">Electric</option>
        <option value="bug">Bug</option>
        <option value="normal">Normal</option>
        <option value="poison">Poison</option>
        <option value="ground">Ground</option>
        <option value="fairy">Fairy</option>
         <option value="rock">Rock</option>
          <option value="dragon">Dragon</option>
         <option value="psychic">Psychic</option>
          <option value="flying">Flying</option>
           <option value="fighting">Fighting</option>
</select>

      <div className="grid">

        {selectedPokemon && (
  <div className="modal">
    <div className="modal-content">
      <button
        className="close"
        onClick={() => setSelectedPokemon(null)}
      >
        X
      </button>

      <h2>{selectedPokemon.name}</h2>
      <img
        src={selectedPokemon.sprites.front_default}
        alt={selectedPokemon.name}
      />

      <h3>Stats</h3>
      {selectedPokemon.stats.map((s) => (
        <p key={s.stat.name}>
          {s.stat.name}: {s.base_stat}
        </p>
      ))}

      <h3>Abilities</h3>
      {selectedPokemon.abilities.map((a) => (
        <p key={a.ability.name}>{a.ability.name}</p>
      ))}
    </div>
  </div>
)}

        {filtered.map((p) => (
          <div
            className="card"
            key={p.id}
            style={{
              background: getTypeColor(p.types[0].type.name),
            }}
            onClick={() => setSelectedPokemon(p)}
          >
            <button
              className="fav"
              onClick={(e) => {e.stopPropagation();  toggleFav(p.id)}}
            >
              {favorites.includes(p.id) ? "⭐" : "☆"}
            </button>

            <img src={p.sprites.front_default} alt={p.name} />
            <p>{p.name}</p>
            <p>type= "{p.types[0].type.name}"</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 20)} disabled={page === 0}>
          Prev
        </button>
        <button onClick={() => setPage(page + 20)}>Next</button>
      </div>
    </div>
  );
}

// 🎨 Type colors
const getTypeColor = (type) => {
  const colors = {
    fire: "#fddfdf",
    grass: "#defde0",
    ground: "#fcf7de",
    water: "#def3fd",
    electric: "#f4e7da",
    rock: "#d5d5d4",
    fairy: "#fceaff",
    bug: "#e0c3fc",
    poison: "#f8d5a3",
    dragon: "#97b3e6",
    psychic: "#eaeda1",
    flying: "#cb7676",
    fighting: "#e6e0d4",
    normal: "#c6bfe0",
  };
  return colors[type] || "#f5f5f5";
};