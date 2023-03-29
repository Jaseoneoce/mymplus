import './App.css';
import React, { useState } from "react";

function App() {
  const [characterList, setCharacterList] = useState("");
  const [tableData, setTableData] = useState([]);

  const handleButtonClick = async () => {
    const characterNames = characterList.split(",");
    const currentData = [...tableData];

    const characterScores = await Promise.all(
      characterNames.map(async (name) => {
        const response = await fetch(
          `https://raider.io/api/v1/characters/profile?region=us&realm=Frostmourne&name=${name}&fields=mythic_plus_scores_by_season:current,mythic_plus_best_runs,mythic_plus_alternate_runs,mythic_plus_ranks`
        );
        const data = await response.json();

        if (!data.name) {
          return null;
        }

        const existingCharacter = currentData.find(
          (character) => character.name === data.name
        );

        if (existingCharacter) {
          return null;
        }

        return {
          name: data.name,
          score: data.mythic_plus_scores_by_season[0].scores.all,
          bestRuns: data.mythic_plus_best_runs,
          alternateRuns: data.mythic_plus_alternate_runs,
          ranks: data.mythic_plus_ranks,
        };
      })
    );

    const newData = characterScores.filter((character) => character !== null);

    if (newData.length > 0) {
      setTableData([...currentData, ...newData]);
    }
  };

  const handleInputChange = (event) => {
    setCharacterList(event.target.value);
  };

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Best Runs</th>
            <th>Alternate Runs</th>
            <th>Ranks</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((character) => (
            <tr key={character.name}>
              <td>{character.name}</td>
              <td>{character.score}</td>
              <td>{JSON.stringify(character.bestRuns)}</td>
              <td>{JSON.stringify(character.alternateRuns)}</td>
              <td>{JSON.stringify(character.ranks)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={characterList}
          onChange={handleInputChange}
        />
        <button onClick={handleButtonClick}>Fetch Data</button>
      </div>
      {renderTable()}
    </div>
  );
}

export default App;