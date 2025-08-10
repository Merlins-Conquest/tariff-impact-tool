import { useState, useEffect } from 'react';

const defaultJson = '{\n  "commodity": "electronics",\n  "rate": 0.1\n}';

export default function App() {
  const [json, setJson] = useState(defaultJson);
  const [status, setStatus] = useState('');
  const [feed, setFeed] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  const send = async () => {
    try {
      const body = JSON.parse(json);
      const res = await fetch(`${API}/demo/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('Sent!');
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const loadFeed = async () => {
    try {
      const res = await fetch(`${API}/feed/latest`);
      const data = await res.json();
      setFeed(data);
    } catch (err) {
      setFeed([{ error: err.message }]);
    }
  };

  useEffect(() => { loadFeed(); }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>Tariff Events</h1>
      <textarea
        style={{ width: '100%', height: '100px' }}
        value={json}
        onChange={e => setJson(e.target.value)}
      />
      <div>
        <button style={{ marginTop: '0.5rem' }} onClick={send}>Send to Event Hub</button>
      </div>
      {status && <p>{status}</p>}
      <h2>Live Feed</h2>
      <button onClick={loadFeed} style={{ marginBottom: '0.5rem' }}>Refresh</button>
      <ul>
        {feed.map((item, idx) => (
          <li key={idx} style={{ wordBreak: 'break-all' }}>
            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}
