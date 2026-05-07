import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  'idea':          { label: 'فكرة',          color: 'var(--purple)', bg: 'rgba(167,139,250,0.12)' },
  'in-development':{ label: 'قيد التطوير',   color: 'var(--accent)',  bg: 'rgba(79,142,247,0.12)' },
  'testing':       { label: 'اختبار',         color: 'var(--yellow)', bg: 'rgba(251,191,36,0.12)' },
  'launched':      { label: 'تم الإطلاق',    color: 'var(--green)',  bg: 'rgba(52,211,153,0.12)' },
  'discontinued':  { label: 'متوقف',          color: 'var(--red)',    bg: 'rgba(248,113,113,0.12)' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products/stats/summary'),
      api.get('/products?limit=5')
    ]).then(([statsRes, productsRes]) => {
      setStats(statsRes.data);
      setRecent(productsRes.data.slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="spinner" />
    </div>
  );

  const getStatusCount = (status) =>
    stats?.byStatus?.find(s => s._id === status)?.count || 0;

  return (
    <div className="animate-in" style={{ padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>مرحباً، {user?.name} 👋</h1>
        <p style={{ color: 'var(--text2)', marginTop: '4px', fontSize: '13px' }}>إليك ملخص المنتجات اليوم</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'إجمالي المنتجات', value: stats?.total || 0, color: 'var(--accent)', icon: '📦' },
          { label: 'قيد التطوير', value: getStatusCount('in-development'), color: 'var(--accent)', icon: '⚙️' },
          { label: 'تم الإطلاق', value: getStatusCount('launched'), color: 'var(--green)', icon: '🚀' },
          { label: 'أفكار', value: getStatusCount('idea'), color: 'var(--purple)', icon: '💡' },
          { label: 'اختبار', value: getStatusCount('testing'), color: 'var(--yellow)', icon: '🧪' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600' }}>توزيع الحالات</h2>
          </div>
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = getStatusCount(key);
            const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={key} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text2)' }}>{cfg.label}</span>
                  <span style={{ color: 'var(--text)', fontWeight: '600' }}>{count}</span>
                </div>
                <div style={{ height: '5px', background: 'var(--bg3)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cfg.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600' }}>آخر المنتجات</h2>
            <Link to="/products" className="btn btn-ghost btn-sm">عرض الكل</Link>
          </div>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>لا توجد منتجات بعد</p>
          ) : recent.map(p => (
            <div key={p._id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 0', borderBottom: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{p.name}</span>
              <span className="badge" style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}>
                {statusConfig[p.status]?.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
