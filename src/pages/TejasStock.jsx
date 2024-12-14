import React, { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa"; // FontAwesome icon for sorting

const TejasStock = () => {
  const [tejasStocks, setTejasStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search input for Challan No
  const [dateFrom, setDateFrom] = useState(""); // Starting date for range
  const [dateTo, setDateTo] = useState(""); // Ending date for range
  const [sortOrder, setSortOrder] = useState("desc"); // Sorting: 'desc' for newest first

  useEffect(() => {
    // Function to fetch Tejas Stock data
    const fetchTejasStockData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/view-tejas-stock"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Tejas stock data");
        }

        const data = await response.json();
        setTejasStocks(data.data);
        setFilteredStocks(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTejasStockData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filteredData = tejasStocks;

    // Filter by Challan No
    if (searchTerm) {
      filteredData = filteredData.filter((stock) =>
        stock.challan.toUpperCase().includes(searchTerm.toUpperCase())
      );
    }

    // Filter by Date Range
    if (dateFrom || dateTo) {
      filteredData = filteredData.filter((stock) => {
        const stockDate = new Date(stock.date_of_receive);
        const from = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
        const to = dateTo ? new Date(dateTo) : new Date();

        return stockDate >= from && stockDate <= to;
      });
    }

    // Sort by Receive Date
    filteredData = filteredData.sort((a, b) => {
      const dateA = new Date(a.date_of_receive);
      const dateB = new Date(b.date_of_receive);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredStocks([...filteredData]);
  }, [searchTerm, dateFrom, dateTo, sortOrder, tejasStocks]);

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <strong>Loading...</strong>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Tejas Stock Entries</h1>

      {/* Filters */}
      <div className="row mb-3 align-items-center">
        {/* Date From */}
        <div className="col-6 col-md-3 mb-2">
          <label className="form-label">Date From</label>
          <input
            type="date"
            className="form-control"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="col-6 col-md-3 mb-2">
          <label className="form-label">Date To</label>
          <input
            type="date"
            className="form-control"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* Search by Challan No (Top-Right Corner) */}
        <div className="col-12 col-md-6 mb-2 text-md-end">
          <label className="form-label">Search Challan No</label>
          <input
            type="text"
            placeholder="Search by Challan No"
            className="form-control text-uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Sr. No.</th>
              <th>
                Receive Date{" "}
                <FaSort
                  onClick={handleSortToggle}
                  style={{ cursor: "pointer" }}
                  title="Sort by Date"
                />
              </th>
              <th>Challan No</th>
              <th>Quality Name</th>
              <th>Total Roll</th>
              <th>Total FNS MTR</th>
              <th>Total Bill Amt</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, stockIndex) =>
              stock.stock_array.map((item, index) => (
                <tr key={`${stock._id}-${index}`}>
                  {/* Sr. No */}
                  <td>{stockIndex + 1}</td>

                  {/* Receive Date */}
                  <td>
                    {new Date(stock.date_of_receive).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>

                  {/* Challan No */}
                  <td>{stock.challan}</td>

                  {/* Quality Name */}
                  <td>{item.grey_quality}</td>

                  {/* Total Roll */}
                  <td>{item.total_roll}</td>

                  {/* Total FNS MTR */}
                  <td>{item.total_fns_mtr}</td>

                  {/* Total Bill Amount */}
                  <td>{item.total_amt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TejasStock;
