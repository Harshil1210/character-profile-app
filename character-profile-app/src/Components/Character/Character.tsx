import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";

interface Character {
  id: number;
  name: string;
  status: string;
  image: string;
  type: string;
  species: string;
  origin: {
    name: string;
    url: string;
  };
  gender: object;

  episode: string[];
  location: {
    name: string;
    url: string;
  };
  created: string;
}

interface ApiResponse {
  info: {
    count: number | null;
    next: string | null;
    prev: string | null;
    pages: number | null;
  };
  results: Character[];
}

const Characters = () => {
  const Navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameQuery, setNameQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [typeQuery, setTypeQuery] = useState("");
  const [itemsPerPage, setItemPerPage] = useState<number>(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response: AxiosResponse<ApiResponse> = await axios.get(
          "https://rickandmortyapi.com/api/character"
        );
        setCharacters(response.data.results);
        setNextPageUrl(response.data.info.next);
        setItemPerPage(response.data.results.length);
      } catch (error) {
        console.error("Error fetching character data:", error);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    const fetchNextPage = async () => {
      try {
        if (nextPageUrl) {
          const response: AxiosResponse<ApiResponse> = await axios.get(
            nextPageUrl
          );
          setCharacters((prevCharacters) => [
            ...prevCharacters,
            ...response.data.results,
          ]);
          setNextPageUrl(response.data.info.next);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Error fetching next page data:", error);
      }
    };

    fetchNextPage();
  }, [nextPageUrl]);

  const getStatusStyle = (status: string): React.CSSProperties => {
    switch (status.toLowerCase()) {
      case "alive":
        return { backgroundColor: "green", color: "white" };
      case "dead":
        return { backgroundColor: "red", color: "white" };
      default:
        return { backgroundColor: "gray", color: "white" };
    }
  };

  const indexOfLastCharacter = currentPage * itemsPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - itemsPerPage;
  const filteredCharacters = characters.filter((character) => {
    const nameMatch = character.name
      .toLowerCase()
      .includes(nameQuery.toLowerCase());
    const locationMatch = character.location.name
      .toLowerCase()
      .includes(locationQuery.toLowerCase());
    const typeMatch = character.type
      .toLowerCase()
      .includes(typeQuery.toLowerCase());

    return nameMatch && locationMatch && typeMatch;
  });
  const charactersToDisplay = filteredCharacters.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeQuery(event.target.value);
    setCurrentPage(1);
  };

  const navigateToCharacterDetails = (characterId: number) => {
    Navigate(`/characterDetails/${characterId}`);
  };

  const pageButtons = (): JSX.Element[] => {
    const totalPageCount = Math.ceil(filteredCharacters.length / itemsPerPage);

    const buttons: JSX.Element[] = [];

    if (totalPageCount <= 5) {
      for (let i = 1; i <= totalPageCount; i++) {
        buttons.push(
          <li
            key={i}
            onClick={() => paginate(i)}
            className={`cursor-pointer px-2 md:px-4 lg:px-6 py-2 rounded ${
              currentPage === i
                ? "underline bg-blue-500 text-white"
                : "hover:underline hover:bg-blue-200 text-blue-500"
            }`}
          >
            {i}
          </li>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          buttons.push(
            <li
              key={i}
              onClick={() => paginate(i)}
              className={`cursor-pointer px-2 md:px-4 lg:px-6 py-2 rounded ${
                currentPage === i
                  ? "underline bg-blue-500 text-white"
                  : "hover:underline hover:bg-blue-200 text-blue-500"
              }`}
            >
              {i}
            </li>
          );
        }
        buttons.push(
          <li
            key="ellipsis-end"
            className="cursor-not-allowed px-2 md:px-4 lg:px-6 py-2 rounded"
          >
            ...
          </li>
        );
        buttons.push(
          <li
            key={totalPageCount}
            onClick={() => paginate(totalPageCount)}
            className={`cursor-pointer px-2 md:px-4 lg:px-6 py-2 rounded ${
              currentPage === totalPageCount
                ? "underline bg-blue-500 text-white"
                : "hover:underline hover:bg-blue-200 text-blue-500"
            }`}
          >
            {totalPageCount}
          </li>
        );
      } else if (currentPage >= totalPageCount - 2) {
        buttons.push(
          <li
            key={1}
            onClick={() => paginate(1)}
            className={`cursor-pointer px-2 md:px-4 lg:px-6 py-2 rounded ${
              currentPage === 1
                ? "underline bg-blue-500 text-white"
                : "hover:underline hover:bg-blue-200 text-blue-500"
            }`}
          >
            1
          </li>
        );
        buttons.push(
          <li
            key="ellipsis-start"
            className="cursor-not-allowed px-2 md:px-4 lg:px-6 py-2 rounded"
          >
            ...
          </li>
        );
        for (let i = totalPageCount - 4; i <= totalPageCount; i++) {
          buttons.push(
            <li
              key={i}
              onClick={() => paginate(i)}
              className={`cursor-pointer px-2 md:px-4 lg:px-6 py-2 rounded ${
                currentPage === i
                  ? "underline bg-blue-500 text-white"
                  : "hover:underline hover:bg-blue-200 text-blue-500"
              }`}
            >
              {i}
            </li>
          );
        }
      } else {
        buttons.push(
          <li
            key={1}
            onClick={() => paginate(1)}
            className={`cursor-pointer px-2 md:px-4 lg:px-6 py-2 rounded ${
              currentPage === 1
                ? "underline bg-blue-500 text-white"
                : "hover:underline hover:bg-blue-200 text-blue-500"
            }`}
          >
            1
          </li>
        );
        buttons.push(
          <li
            key="ellipsis-start"
            className="cursor-not-allowed px-2 md:px-4 lg:px-6 py-2 rounded"
          >
            ...
          </li>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(
            <li
              key={i}
              onClick={() => paginate(i)}
              className={`cursor-pointer px-2 md:px-4 lg:px-6 py-2 rounded ${
                currentPage === i
                  ? "underline bg-blue-500 text-white"
                  : "hover:underline hover:bg-blue-200 text-blue-500"
              }`}
            >
              {i}
            </li>
          );
        }
        buttons.push(
          <li
            key="ellipsis-end"
            className="cursor-not-allowed px-2 md:px-4 lg:px-6 py-2 rounded"
          >
            ...
          </li>
        );
        buttons.push(
          <li
            key={totalPageCount}
            onClick={() => paginate(totalPageCount)}
            className={`cursor-pointer px-2 md:px-4 lg:px-6 py-2 rounded ${
              currentPage === totalPageCount
                ? "underline bg-blue-500 text-white"
                : "hover:underline hover:bg-blue-200 text-blue-500"
            }`}
          >
            {totalPageCount}
          </li>
        );
      }
    }

    return buttons;
  };

  const noResultsText = (
    <div className="text-3xl text-red-500 mt-10">
      No characters found matching the search criteria.
    </div>
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-5xl font-bold mb-6 text-gradient-green">
        Characters
      </h1>
      <div className="mb-4 flex items-center flex-col md:flex-row md:items-stretch md:space-x-4">
        <input
          type="text"
          placeholder="Search by Name..."
          value={nameQuery}
          onChange={handleNameChange}
          className="mb-2 md:mb-0 border border-gray-300 px-4 py-2 rounded focus:outline-none"
        />
        <input
          type="text"
          placeholder="Search by Location..."
          value={locationQuery}
          onChange={handleLocationChange}
          className="mb-2 md:mb-0 border border-gray-300 px-4 py-2 rounded focus:outline-none"
        />
        <input
          type="text"
          placeholder="Search by Type..."
          value={typeQuery}
          onChange={handleTypeChange}
          className="mb-2 md:mb-0 border border-gray-300 px-4 py-2 rounded focus:outline-none"
        />
      </div>
      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {charactersToDisplay.map((character) => (
            <div
              key={character.id}
              className="bg-gray-100 rounded shadow-md relative border !border-blue-500 "
              onClick={() => navigateToCharacterDetails(character.id)}
            >
              <span
                className="rounded px-2 py-1 text-white absolute top-3 right-3"
                style={getStatusStyle(character.status)}
              >
                {character.status}
              </span>
              <div className="image-container h-90 rounded overflow-hidden">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "../../NoImage/NoImage.jpg";
                  }}
                />
              </div>
              <div className="px-2 py-2 bg-blue-100">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-1">{character.name}</h2>
                </div>
                <p className=" px-2 py-1 mb-1">
                  <span className="font-bold text-blue-500">Type:</span>{" "}
                  {character.type}
                </p>
                <p className=" px-2 py-1 mb-1">
                  <span className="font-bold text-blue-500">
                    Total Episodes:
                  </span>{" "}
                  {character.episode.length}
                </p>
                <p className="px-2 py-1 mb-1">
                  <span className="font-bold text-blue-500 ">
                    Last Location:
                  </span>{" "}
                  {character.location.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        noResultsText
      )}
      {filteredCharacters.length > 0 && (
        <div className="mt-5 mb-4 text-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-block px-2 md:px-4 lg:px-8 py-2 rounded mr-2 ${
              currentPage === 1
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-500 text-white cursor-pointer"
            }`}
          >
            Prev
          </button>
          <ul className="inline-flex space-x-2">{pageButtons()}</ul>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(filteredCharacters.length / itemsPerPage)
            }
            className={`inline-block px-2 md:px-4 lg:px-6 py-2 rounded ml-2 ${
              currentPage ===
              Math.ceil(filteredCharacters.length / itemsPerPage)
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-500 text-white cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Characters;
