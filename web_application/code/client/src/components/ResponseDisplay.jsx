import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import './ResponseDisplay.css';

const ResponseDisplay = ({ response }) => {
  const [activeTab, setActiveTab] = useState('table');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const getTableData = () => {
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return null;
  };

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };

  const sortedTableData = useMemo(() => {
    const data = getTableData();
    if (!data || !Array.isArray(data) || data.length === 0 || !sortColumn) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [getTableData(), sortColumn, sortDirection]);

  const exportToExcel = () => {
    const data = sortedTableData || getTableData();
    if (!data || !Array.isArray(data) || data.length === 0) {
      alert('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    XLSX.writeFile(workbook, `results-${timestamp}.xlsx`);
  };

  const renderTable = (data) => {
    if (!data || typeof data !== 'object') {
      return <p>No tabular data available</p>;
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <p>Empty array</p>;
      }

      const keys = Object.keys(data[0]);
      return (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {keys.map((key) => (
                  <th key={key} onClick={() => handleSort(key)} className="sortable-header">
                    <div className="header-content">
                      <span>{key}</span>
                      <span className="sort-indicator">
                        {sortColumn === key && (
                          sortDirection === 'asc' ? '▲' : '▼'
                        )}
                        {sortColumn !== key && '⇅'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {keys.map((key) => (
                    <td key={key}>
                      {typeof row[key] === 'object'
                        ? JSON.stringify(row[key])
                        : String(row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    const entries = Object.entries(data);
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key}>
                <td><strong>{key}</strong></td>
                <td>
                  {typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="response-display">
      <div className="response-header">
        <h2>Response</h2>
        <div className="response-status">
          <span className={`status-badge status-${Math.floor(response.status / 100)}xx`}>
            {response.status} {response.statusText}
          </span>
          {response.data.totalRequests && (
            <span className="requests-info">
              {response.data.successfulRequests} / {response.data.totalRequests} successful
            </span>
          )}
        </div>
      </div>

      {response.data.responseDetails && (
        <div className="request-details">
          <h3>Request Details</h3>
          <div className="details-list">
            {response.data.responseDetails.map((detail, idx) => (
              <div key={idx} className="detail-item">
                <span className="detail-url">{detail.url}</span>
                <span className={`detail-status ${detail.status === 'error' ? 'error' : 'success'}`}>
                  {detail.status === 'error' ? detail.error : `${detail.status} ${detail.statusText}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON View
          </button>
          <button
            className={`tab ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            Table View
          </button>
        </div>
        {activeTab === 'table' && sortedTableData && sortedTableData.length > 0 && (
          <button className="export-btn" onClick={exportToExcel}>
            Export to Excel
          </button>
        )}
      </div>

      <div className="response-content">
        {activeTab === 'json' ? (
          <div className="json-view">
            <pre>{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        ) : (
          <div className="table-view">
            {sortedTableData && sortedTableData.length > 0 ? (
              <>
                <div className="table-info">
                  <strong>Merged Results:</strong> {sortedTableData.length} total items
                </div>
                {renderTable(sortedTableData)}
              </>
            ) : (
              <p>No results to display</p>
            )}
          </div>
        )}
      </div>

      <div className="response-headers">
        <h3>Response Headers</h3>
        <div className="headers-list">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className="header-item">
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponseDisplay;
