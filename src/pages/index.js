import { useState, useEffect } from 'react';
import Head from 'next/head';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function Home() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load history from Firebase
  useEffect(() => {
    // Only attempt connection if config is valid (skipping in demo mode if keys missing)
    try {
      const q = query(collection(db, "passwords"), orderBy("createdAt", "desc"), limit(10));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        console.log("Firebase connection failed (likely invalid config):", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.log("Firebase init error:", e);
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ length, ...options }),
      });
      const data = await res.json();
      setGeneratedPassword(data.password);

      // Save to Firestore
      try {
        await addDoc(collection(db, "passwords"), {
          password: data.password,
          createdAt: new Date(),
          type: "generated"
        });
      } catch (e) {
        console.warn("Could not save to DB (check config):", e);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Head>
        <title>HACKER_GEN_V1.0</title>
      </Head>
      <div className="scanline"></div>
      <div className="container crt-flicker">
        <h1>&gt; SYSTEM_PASSWORD_GENERATOR</h1>

        <div className="panel">
          <div className="panel-header">CONFIGURATION</div>

          <div className="control-group">
            <label>LENGTH: [{length}]</label>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>

          <div className="control-group">
            <label><input type="checkbox" checked={options.includeUppercase} onChange={() => toggleOption('includeUppercase')} /> UPPERCASE</label>
            <label><input type="checkbox" checked={options.includeLowercase} onChange={() => toggleOption('includeLowercase')} /> LOWERCASE</label>
          </div>

          <div className="control-group">
            <label><input type="checkbox" checked={options.includeNumbers} onChange={() => toggleOption('includeNumbers')} /> NUMERIC</label>
            <label><input type="checkbox" checked={options.includeSymbols} onChange={() => toggleOption('includeSymbols')} /> SYMBOLS</label>
          </div>

          <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
            {loading ? 'GENERATING...' : 'EXECUTE_GENERATION'}
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">OUTPUT_BUFFER</div>
          <div className="result">
            {generatedPassword ? generatedPassword : <span style={{ opacity: 0.5 }}>AWAITING_INPUT...</span>}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">SYSTEM_LOGS (LAST 10)</div>
          <ul className="history-list">
            {history.length === 0 ? (
              <li className="history-item">NO_LOGS_FOUND_OR_DB_OFFLINE</li>
            ) : (
              history.map((item) => (
                <li key={item.id} className="history-item">
                  <span>{item.password}</span>
                  <span>{item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString() : 'NOW'}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
