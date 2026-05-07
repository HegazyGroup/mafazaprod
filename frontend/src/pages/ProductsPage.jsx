import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';

const statusConfig = {
  'idea':           { label: 'فكرة',          color: 'var(--purple)', bg: 'rgba(167,139,250,0.12)' },
  'in-development': { label: 'قيد التطوير',   color: 'var(--accent)',  bg: 'rgba(79,142,247,0.12)' },
  'testing':        { label: 'اختبار',         color: 'var(--yellow)', bg: 'rgba(251,191,36,0.12)' },
  'launched':       { label: 'تم الإطلاق',    color: 'var(--green)',  bg: 'rgba(52,211,153,0.12)' },
  'discontinued':   { label: 'متوقف',          color: 'var(--red)',    bg: 'rgba(248,113,113,0.12)' },
};

const priorityConfig = {
  'low':      { label: 'منخفض',  color: 'var(--text3)' },
  'medium':   { label: 'متوسط',  color: 'var(--yellow)' },
  'high':     { label: 'عالي',   color: 'var(--orange)' },
  'critical': { label: 'حرج',    color: 'var(--red)' },
};

const emptyForm = { name: '', sku: '', description: '', status: 'idea', priority: 'medium', price: '', cost: '', stock: '', targetLaunchDate: '', notes: '', tags: '' };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { api.get('/categories').then(r => setCategories(r.data)); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...emptyForm, ...p, category: p.category?._id || '', tags: (p.tags || []).join(', '), targetLaunchDate: p.targetLaunchDate ? p.targetLaunchDate.split('T')[0] : '' });
    setError(''); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (!data.price) delete data.price;
      if (!data.cost) delete data.cost;
      if (!data.stock) delete data.stock;
      if (!data.sku) delete data.sku;
      if (!data.category) delete data.category;
      if (!data.targetLaunchDate) delete data.targetLaunchDate;

      if (editing) await api.put(`/products/${editing}`, data);
      else await api.post('/products', data);

      setShowModal(false); fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/products/${id}`); setDeleteConfirm(null); fetchProducts(); }
    catch (err) { alert('حدث خطأ في الحذف'); }
  };

  const F = ({ label, children, style }) => (
    <div style={{ marginBottom: '14px', ...style }}>
      <label className="label">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="animate-in" style={{ padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>المنتجات</h1>
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '4px' }}>{products.length} منتج</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          منتج جديد
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input className="input-field" placeholder="بحث في المنتجات..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '280px' }} />
        <select className="input-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ maxWidth: '160px' }}>
          <option value="">كل الحالات</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
          <p>لا توجد منتجات{search || filterStatus ? ' تطابق البحث' : ' بعد'}</p>
          {!search && !filterStatus && <button className="btn btn-primary" onClick={openNew} style={{ marginTop: '16px' }}>أضف أول منتج</button>}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
                  {['الاسم','الفئة','الحالة','الأولوية','السعر','المخزون',''].map((h, i) => (
                    <th key={i} style={{ padding: '11px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '500', fontSize: '13px' }}>{p.name}</div>
                      {p.sku && <div style={{ color: 'var(--text3)', fontSize: '11px', fontFamily: 'var(--mono)' }}>{p.sku}</div>}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: '12px' }}>
                      {p.category?.name || '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge" style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}>
                        {statusConfig[p.status]?.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: priorityConfig[p.priority]?.color, fontSize: '12px', fontWeight: '500' }}>
                        {priorityConfig[p.priority]?.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: '13px', fontFamily: 'var(--mono)' }}>
                      {p.price != null ? `${p.price} ج.م` : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: '13px' }}>{p.stock ?? '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>تعديل</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(p)}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px'
        }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="card animate-in" style={{ width: '100%', maxWidth: '560px', maxHeight: '88vh', overflow: 'auto', borderColor: 'var(--border2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600' }}>{editing ? 'تعديل المنتج' : 'منتج جديد'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '20px', lineHeight: 1 }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <F label="اسم المنتج *" style={{ gridColumn: '1/-1' }}>
                  <input className="input-field" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="اسم المنتج" />
                </F>
                <F label="SKU">
                  <input className="input-field" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="PROD-001" dir="ltr" />
                </F>
                <F label="الفئة">
                  <select className="input-field" value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="">بدون فئة</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </F>
                <F label="الحالة">
                  <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {Object.entries(statusConfig).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </F>
                <F label="الأولوية">
                  <select className="input-field" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    {Object.entries(priorityConfig).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </F>
                <F label="السعر (ج.م)">
                  <input className="input-field" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0" dir="ltr" />
                </F>
                <F label="التكلفة (ج.م)">
                  <input className="input-field" type="number" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} placeholder="0" dir="ltr" />
                </F>
                <F label="المخزون">
                  <input className="input-field" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="0" dir="ltr" />
                </F>
                <F label="تاريخ الإطلاق المستهدف">
                  <input className="input-field" type="date" value={form.targetLaunchDate} onChange={e => setForm({...form, targetLaunchDate: e.target.value})} dir="ltr" />
                </F>
                <F label="وصف" style={{ gridColumn: '1/-1' }}>
                  <textarea className="input-field" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="وصف مختصر..." style={{ resize: 'vertical' }} />
                </F>
                <F label="تاجات (مفصولة بفاصلة)" style={{ gridColumn: '1/-1' }}>
                  <input className="input-field" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="electronics, mobile, accessories" dir="ltr" />
                </F>
                <F label="ملاحظات" style={{ gridColumn: '1/-1' }}>
                  <textarea className="input-field" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="ملاحظات إضافية..." style={{ resize: 'vertical' }} />
                </F>
              </div>

              {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '14px', background: 'rgba(248,113,113,0.1)', padding: '9px 12px', borderRadius: 'var(--radius-sm)' }}>{error}</div>}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <div className="spinner" style={{ width: '14px', height: '14px' }} /> : editing ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="card animate-in" style={{ maxWidth: '360px', width: '90%', borderColor: 'rgba(248,113,113,0.3)' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>تأكيد الحذف</h3>
            <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '20px' }}>
              هتحذف "<strong>{deleteConfirm.name}</strong>"؟ الإجراء ده مش هيتراجع.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>إلغاء</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
