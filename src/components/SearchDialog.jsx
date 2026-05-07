import React, { useState, useEffect } from "react";

const SearchDialog = ({ open, setOpen, data }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const filtered = data.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.type?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query, data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
      <div className="bg-white w-96 rounded-xl shadow-lg p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Search</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 hover:text-red-500"
          >
            ✖
          </button>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search workouts, challenges..."
          className="w-full border p-2 rounded mb-4"
        />

        {/* Results */}
        <div className="max-h-64 overflow-y-auto">
          {results.length === 0 && query && (
            <p className="text-sm text-gray-500">No results found</p>
          )}
          {results.map((item, idx) => (
            <div
              key={idx}
              className="p-2 border-b cursor-pointer hover:bg-emerald-50 rounded"
              onClick={() => {
                alert(`You clicked on: ${item.name || item.title}`);
                setOpen(false);
              }}
            >
              <h3 className="font-semibold">{item.name || item.title}</h3>
              {item.type && (
                <p className="text-xs text-gray-500">{item.type}</p>
              )}
              {item.description && (
                <p className="text-sm text-gray-700">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
