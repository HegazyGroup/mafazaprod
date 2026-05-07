import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const DEPARTMENTS = ['Marketing', 'Purchasing', 'Quality', 'R&D', 'Sales', 'Supply Chain', 'Other'];

export default function RegisterPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', jobTitle: '', department: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('كلمتا المرور غير متطابقتين');
    if (form.password.length < 6) return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    if (!form.department) return setError('يرجى اختيار الإدارة');

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        jobTitle: form.jobTitle,
        department: form.department,
      });
      // Auto login after register
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '20px',
      backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(79,142,247,0.07) 0%, transparent 60%)'
    }}>
      <div className="animate-in" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            marginBottom: '12px', boxShadow: '0 8px 32px rgba(79,142,247,0.3)'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)' }}>Mafaza</h1>
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '4px' }}>نظام إدارة المنتجات</p>
        </div>

        <div className="card" style={{ borderColor: 'var(--border2)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>إنشاء حساب جديد</h2>
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: '13px' }}>
              <label className="label">الاسم الكامل *</label>
              <input className="input-field" required value={form.name} onChange={set('name')} placeholder="محمد أحمد" />
            </div>

            {/* Job Title */}
            <div style={{ marginBottom: '13px' }}>
              <label className="label">المسمى الوظيفي</label>
              <input className="input-field" value={form.jobTitle} onChange={set('jobTitle')} placeholder="مدير منتجات، محلل مبيعات..." />
            </div>

            {/* Department */}
            <div style={{ marginBottom: '13px' }}>
              <label className="label">الإدارة *</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="input-field"
                  required
                  value={form.department}
                  onChange={set('department')}
                  style={{ appearance: 'none', paddingLeft: '32px' }}
                >
                  <option value="">اختر إدارتك</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '13px' }}>
              <label className="label">البريد الإلكتروني *</label>
              <input className="input-field" type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" dir="ltr" />
            </div>

            {/* Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <div>
                <label className="label">كلمة المرور *</label>
                <input className="input-field" type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" dir="ltr" />
              </div>
              <div>
                <label className="label">تأكيد كلمة المرور *</label>
                <input className="input-field" type="password" required value={form.confirm} onChange={set('confirm')} placeholder="••••••••" dir="ltr" />
              </div>
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
              {loading ? <div className="spinner" style={{ width: '16px', height: '16px' }} /> : 'إنشاء حساب'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text2)' }}>
            لديك حساب بالفعل؟{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '500' }}>سجل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
