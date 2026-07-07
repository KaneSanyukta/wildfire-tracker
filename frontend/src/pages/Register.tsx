import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REGIONS = [
  'California', 'Oregon', 'Washington', 'Arizona', 'Colorado',
  'Nevada', 'New Mexico', 'Texas', 'Idaho', 'Montana',
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredRegion, setPreferredRegion] = useState(REGIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password, preferredRegion);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span aria-hidden>🔥</span> Wildfire Tracker
        </div>
        <h1>Create your account</h1>
        <p className="auth-card__subtitle">Set a preferred region to get relevant wildfire alerts.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Rivera" />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </label>
          <label>
            Preferred region
            <select value={preferredRegion} onChange={(e) => setPreferredRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
