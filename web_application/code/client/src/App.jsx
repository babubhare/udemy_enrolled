import { useState } from 'react';
import HeaderInputs from './components/HeaderInputs';
import ResponseDisplay from './components/ResponseDisplay';
import './App.css';

function App() {
  const [urls, setUrls] = useState('');
  const [headers, setHeaders] = useState({
    'Host': 'www.udemy.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Referer': 'https://www.udemy.com/',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Udemy-Cache-Brand': 'INen_US',
    'X-Udemy-Cache-Campaign-Code': 'CP250105G1',
    'X-Udemy-Cache-Marketplace-Country': 'IN',
    'X-Udemy-Cache-Price-Country': 'IN',
    'X-Udemy-Cache-Release': '3721de07decc2ba1c37d',
    'X-Udemy-Cache-User': '9267882',
    'X-Udemy-Cache-Version': '1',
    'X-Udemy-Cache-Language': 'en',
    'X-Udemy-Cache-Device': 'None',
    'X-Udemy-Cache-Logged-In': '1',
    'Connection': 'keep-alive',
    'XrQGk': '__cfruid=68872d2997fad0bf77b9dea56bf4655cbd39dcac-1767682179',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
  });
  const [cookie, setCookie] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleHeaderChange = (key, value) => {
    setHeaders(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const urlList = urls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      if (urlList.length === 0) {
        throw new Error('Please enter at least one URL');
      }

      const headersToSend = { ...headers };
      if (cookie) {
        headersToSend['Cookie'] = cookie;
      }

      const res = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: urlList,
          headers: headersToSend,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>HTTP Request Tool</h1>
        <p>Make custom HTTP GET requests with configurable headers</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="request-form">
          <div className="url-section">
            <label htmlFor="urls">GET Request URLs (one per line)</label>
            <textarea
              id="urls"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example.com/api/endpoint1&#10;https://example.com/api/endpoint2&#10;https://example.com/api/endpoint3"
              rows="5"
              required
            />
          </div>

          <HeaderInputs
            headers={headers}
            onHeaderChange={handleHeaderChange}
          />

          <div className="cookie-section">
            <label htmlFor="cookie">Cookie</label>
            <textarea
              id="cookie"
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="Enter cookie value"
              rows="3"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending Request...' : 'Send Request'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && <ResponseDisplay response={response} />}
      </main>
    </div>
  );
}

export default App;
