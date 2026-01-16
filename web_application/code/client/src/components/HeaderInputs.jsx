import './HeaderInputs.css';

const HeaderInputs = ({ headers, onHeaderChange }) => {
  const headerKeys = [
    'Host',
    'User-Agent',
    'Accept',
    'Accept-Language',
    'Accept-Encoding',
    'Referer',
    'X-Requested-With',
    'X-Udemy-Cache-Brand',
    'X-Udemy-Cache-Campaign-Code',
    'X-Udemy-Cache-Marketplace-Country',
    'X-Udemy-Cache-Price-Country',
    'X-Udemy-Cache-Release',
    'X-Udemy-Cache-User',
    'X-Udemy-Cache-Version',
    'X-Udemy-Cache-Language',
    'X-Udemy-Cache-Device',
    'X-Udemy-Cache-Logged-In',
    'Connection',
    'XrQGk',
    'Sec-Fetch-Dest',
    'Sec-Fetch-Mode',
    'Sec-Fetch-Site',
  ];

  return (
    <div className="headers-section">
      <h2>Request Headers</h2>
      <div className="headers-grid">
        {headerKeys.map((key) => (
          <div key={key} className="header-input-group">
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              type="text"
              value={headers[key] || ''}
              onChange={(e) => onHeaderChange(key, e.target.value)}
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderInputs;
