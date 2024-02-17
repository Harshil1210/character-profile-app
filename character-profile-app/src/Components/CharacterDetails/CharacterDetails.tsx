// CharacterDetails.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Audio } from "react-loader-spinner";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
  image: string;
  episode: string[];
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get<Character>(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        setCharacter(response.data);

        const episodesData = await Promise.all(
          response.data.episode.map((episodeURL) =>
            axios.get<Episode>(episodeURL)
          )
        );
        setEpisodes(episodesData.map((episode) => episode.data));
      } catch (error) {
        console.error("Error fetching character details:", error);
      }
    };

    fetchCharacter();
  }, [id]);

  if (!character) {
    return (
      <div className="flex justify-center align-center">
        <Audio
          height={80}
          width={80}
          color="green"
          ariaLabel="loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 ">
      <div className="!items-center px-4 mb-4  ">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          {character.name}
        </h1>
        <img
          src={character.image}
          alt={character.name}
          className="mb-4 rounded-lg shadow-md"
        />
        <p className="text-white">
          <span className="font-bold">Status:</span> {character.status}
        </p>
        <p className="text-white">
          <span className="font-bold">Species:</span> {character.species}
        </p>
        <p className="text-white">
          <span className="font-bold">Gender:</span> {character.gender}
        </p>
        <p className="text-white">
          <span className="font-bold">Origin:</span> {character.origin.name}
        </p>
        <p className="text-white">
          <span className="font-bold">Location:</span> {character.location.name}
        </p>
      </div>

      <div className="w-full ">
        <h2 className="text-4xl text-white font-bold mb-4">Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="border p-4 rounded shadow-md !border-blue-500"
            >
              <h3 className="text-lg font-bold mb-2  text-red-500">
                {episode.name}
              </h3>
              <p className="font-semibold text-blue-500 ">
                Air Date: {episode.air_date}
              </p>
              <p className="text-blue-500">Episode: {episode.episode}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
