import React, { useEffect, useState } from 'react';

const TejasStock = () => {
    const [tejasStocks, setTejasStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch Tejas Stock data
        const fetchTejasStockData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/view-tejas-stock');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch Tejas stock data');
                }

                const data = await response.json();
                setTejasStocks(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTejasStockData();
    }, []);

    if (loading) {
        return <div className="text-center mt-5"><strong>Loading...</strong></div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">Error: {error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Tejas Stock Entries</h1>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>Quality Name</th>
                            <th>Total Roll</th>
                            <th>Total FNS MTR</th>
                            <th>Total Bill Amt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tejasStocks.map(stock => 
                            stock.stock_array.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.grey_quality}</td>
                                    <td>{item.total_roll}</td>
                                    <td>{item.total_fns_mtr}</td>
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
