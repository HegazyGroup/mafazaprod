import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '20px',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(79,142,247,0.07) 0%, transparent 60%)'
    }}>
      <div className="animate-in" style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            marginBottom: '14px', boxShadow: '0 8px 32px rgba(79,142,247,0.3)'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)' }}>Mafaza</h1>
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '4px' }}>نظام إدارة المنتجات</p>
        </div>

        {/* Form */}
        <div className="card" style={{ borderColor: 'var(--border2)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>تسجيل الدخول</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label className="label">البريد الإلكتروني</label>
              <input
                className="input-field"
                type="email" required
                placeholder="example@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                dir="ltr"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="label">كلمة المرور</label>
              <input
                className="input-field"
                type="password" required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                dir="ltr"
              />
            </div>
            {error && (
              <div style={{
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                color: 'var(--red)', fontSize: '13px', marginBottom: '14px'
              }}>{error}</div>
            )}
            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '14px' }}>
              {loading ? <div className="spinner" style={{ width: '16px', height: '16px' }} /> : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
