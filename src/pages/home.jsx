import { useState } from "react";
import { id3, predict } from "../Algo/id3";

function App() {
  const [features, setFeatures] = useState(0);
  const [entriesList, setEntriesList] = useState([[]]);
  const [entryArray, setEntryArray] = useState([]);
  const [featureArray, setFeatureArray] = useState([]);
  const [query, setQuery] = useState([]);
  const [result, setResult] = useState("");

  const set = (value) => {
    const num = parseInt(value);
    setEntryArray(new Array(num).fill(""));
  };

  const set1 = (value) => {
    const num = parseInt(value);
    setFeatures(num);
    setFeatureArray(new Array(num).fill(""));
  };

  const handleSumbit = (e) => {
    e.preventDefault();
    console.log(entriesList);
    console.log(query);
    let featuresMod = [];
    for (let i = 0; i < features - 1; i++) {
      featuresMod.push(i);
    }
    const decisionTree = id3(entriesList, featuresMod);
    const result = predict(decisionTree, query);
    setResult(result);
  };

  const handleEntriesList = (e, index, i) => {
    let temp = entriesList;
    if (!temp[index]) {
      temp[index] = [];
    }
    temp[index][i] = e.target.value;
    setEntriesList(temp);
  };

  return (
    <>
      <div
        className="text-center text-4xl py-12"
        style={{ backgroundColor: "chartreuse" }}
      >
        DWDM ASSGINMENT: ID3 ALGORITHM
      </div>
      <div className="text-center bg-black text-white text-2xl">Home</div>
      <p className="text-center bg-black text-white">
        Welcome to the home page!
      </p>
      <div
        className="bg-cover py-16 px-4 md:px-64"
        style={{ backgroundColor: "chartreuse" }}
      >
        <p className="text-center text-2xl">
          Fill in the details below to get started
        </p>
        <form
          className="bg-black flex flex-col items-center py-12 px-4 gap-4 rounded-xl"
          onSubmit={handleSumbit}
        >
          <div className="flex flex-row gap-4">
            <label className="text-white">
              Number of features (Including target):
            </label>
            <input
              type="number"
              className="px-2 py-1 rounded-md"
              placeholder="eg.1,2"
              onChange={(e) => set1(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-4">
            <label className="text-white">Number of entries:</label>
            <input
              type="number"
              className="px-2 py-1 rounded-md"
              placeholder="eg.1,2"
              onChange={(e) => set(e.target.value)}
            />
          </div>
          {entryArray.map((entry, index) => (
            <div className="flex flex-row gap-4" key={index}>
              <label className="text-white">Entry {index + 1}:</label>
              {featureArray.map((_, i) => (
                // eslint-disable-next-line react/jsx-key
                <input
                  type="text"
                  className="px-2 py-1 rounded-md"
                  placeholder="eg.Sunny"
                  onChange={(e) => handleEntriesList(e, index, i)}
                />
              ))}
            </div>
          ))}
          <label className="text-white">Question Entry:</label>
          {featureArray.map(
            (_, i) =>
              // eslint-disable-next-line react/jsx-key
              featureArray.length - 1 !== i && (
                // eslint-disable-next-line react/jsx-key
                <input
                  type="text"
                  className="px-2 py-1 rounded-md"
                  placeholder="eg.Sunny"
                  onChange={(e) => {
                    let temp = query;
                    temp[i] = e.target.value;
                    setQuery(temp);
                  }}
                />
              )
          )}
          <button
            className="py-2 px-2 rounded-full"
            style={{ backgroundColor: "chartreuse" }}
            type="submit"
          >
            Submit
          </button>
        </form>
        {result && (
          <p className="text-center text-2xl">
            The result of the query is: {result}
          </p>
        )}
      </div>
    </>
  );
}

export default App;
