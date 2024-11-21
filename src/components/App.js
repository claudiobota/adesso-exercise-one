"use client";

import { useEffect, useState } from "react";

const columns = ["Name", "Age", "Country", "Email", "Role"];
const mockData = Array.from({ length: 50 }, (_, index) => ({
  Name: `User ${index + 1}`,
  Age: 20 + (index % 30),
  Country: ["USA", "Germany", "India", "Brazil", "Canada"][index % 5],
  Email: `user${index + 1}@example.com`,
  Role: ["Admin", "Editor", "Viewer"][index % 3],
}));

const mockFetch = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.1; // Simulate occasional failures
      if (shouldFail) {
        reject("Mock fetch failed");
      } else {
        resolve([
          { id: 1, name: "Alice", description: "A software engineer" },
          { id: 2, name: "Bob", description: "A product manager" },
          { id: 3, name: "Charlie", description: "A designer" },
          { id: 4, name: "Diana", description: "A data scientist" },
        ]);
      }
    }, 1000);
  });

const App = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterRows, setFilterRows] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await mockFetch();
        setRows(result);
        setFilteredRows(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filterRows) {
      setFilteredRows(
        rows.filter((item) =>
          item.name.toLowerCase().includes(filterRows.toLowerCase())
        )
      );
    } else {
      setFilteredRows(rows);
    }
  }, [filterRows, rows]);

  const handleFilterChange = (column, value) => {
    setFilters({ ...filters, [column]: value.toLowerCase() });
  };

  const filteredData = mockData.filter((row) =>
    Object.keys(filters).every(
      (key) =>
        !filters[key] ||
        row[key].toString().toLowerCase().includes(filters[key])
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
          <div className="flex justify-around mb-4">
            <button
              className={`px-4 py-2 rounded ${
                selectedTab === "home"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedTab("home")}
            >
              Home
            </button>
            <button
              className={`px-4 py-2 rounded ${
                selectedTab === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedTab("table")}
            >
              Table
            </button>
            <button
              className={`px-4 py-2 rounded ${
                selectedTab === "large-component"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedTab("large-component")}
            >
              Large Component
            </button>
          </div>
          <div className="p-4 border-t">
            {selectedTab === "home" && (
              <div className="text-center">Home Content</div>
            )}
            {selectedTab === "table" && (
              <div className="p-4">
                <div className="overflow-x-auto border rounded-lg shadow-md">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col}
                            className="px-4 py-2 text-gray-600 font-medium text-sm uppercase"
                          >
                            <div className="flex flex-col">
                              <span>{col}</span>
                              <input
                                type="text"
                                placeholder={`Filter ${col}`}
                                className="mt-1 p-1 border rounded text-sm text-gray-700"
                                onChange={(e) =>
                                  handleFilterChange(col, e.target.value)
                                }
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`${
                              rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } border-b`}
                          >
                            {columns.map((col) => (
                              <td key={col} className="px-4 py-2">
                                {row[col]}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="px-4 py-2 text-center text-gray-500"
                          >
                            No results found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {selectedTab === "large-component" && (
              <div className="p-4">
                <h1 className="text-xl font-bold">Table</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={filterRows}
                        onChange={(e) => setFilterRows(e.target.value)}
                        placeholder="Filter by name"
                        className="border p-2 rounded"
                      />
                    </div>
                    <ul className="space-y-2">
                      {filteredRows.map((item) => (
                        <li
                          key={item.id}
                          className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <h2 className="text-lg font-medium">{item.name}</h2>
                          <p>{item.description}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
