# 🚀 Mafaza Product Manager

نظام إدارة منتجات كامل مبني بـ React + Node.js + MongoDB

## 🗂️ هيكل المشروع

```
mafaza-app/
├── frontend/     → React + Vite (ترفعه على Vercel)
└── backend/      → Node.js + Express (ترفعه على Vercel كـ Serverless)
```

---

## ⚙️ الإعداد خطوة بخطوة

### 1. MongoDB Atlas

1. افتح https://account.mongodb.com
2. اعمل **New Project** واسمه `mafaza`
3. اعمل **Free Cluster** (M0)
4. من **Database Access** → Add user بـ username + password
5. من **Network Access** → Add IP Address → `0.0.0.0/0` (Allow from anywhere)
6. من **Connect** → Drivers → انسخ الـ Connection String
   - بيبقى شكله: `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/`
   - استبدل `<password>` بكلمة المرور

---

### 2. رفع الـ Backend على Vercel

```bash
cd backend
cp .env.example .env
# عدّل الـ .env بقيم حقيقية
```

افتح https://vercel.com:
1. **New Project** → Import من GitHub (ارفع الـ backend folder أو الـ repo كله)
2. **Root Directory**: اختار `backend`
3. **Environment Variables** أضف:
   - `MONGODB_URI` = connection string من MongoDB Atlas
   - `JWT_SECRET` = أي نص طويل عشوائي (مثلاً: `mafaza_super_secret_2024_xyz`)
   - `CLIENT_URL` = رابط الـ frontend على Vercel (هتعرفه بعد ما ترفع الـ frontend)
4. Deploy!

---

### 3. رفع الـ Frontend على Vercel

```bash
cd frontend
cp .env.example .env
# عدّل VITE_API_URL برابط الـ backend اللي رفعته
```

افتح Vercel:
1. **New Project** → Import
2. **Root Directory**: اختار `frontend`
3. **Environment Variables** أضف:
   - `VITE_API_URL` = `https://your-backend.vercel.app/api`
4. Deploy!

---

### 4. إنشاء أول مستخدم (Admin)

بعد الـ deploy، ابعت request لـ:

```
POST https://your-backend.vercel.app/api/auth/register
Content-Type: application/json

{
  "name": "اسمك",
  "email": "email@example.com",
  "password": "password123",
  "role": "admin"
}
```

ممكن تعمل ده من أي REST client أو Postman.

---

## 🔧 تشغيل محلياً للتطوير

```bash
# Backend
cd backend
npm install
cp .env.example .env
# عدّل الـ .env
npm run dev

# Frontend (terminal تاني)
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## ✅ المميزات

- 🔐 Authentication بـ JWT (مش Supabase - يشتغل على أي شبكة)
- 📦 إدارة منتجات كاملة (إضافة، تعديل، حذف، بحث، فلترة)
- 📊 Dashboard بإحصائيات
- 🏷️ فئات للمنتجات
- 👤 نظام صلاحيات (admin / manager / viewer)
- 🌙 Dark mode
- 🇦🇪 واجهة عربية

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | تسجيل مستخدم جديد |
| POST | /api/auth/login | تسجيل دخول |
| GET | /api/auth/me | بيانات المستخدم الحالي |
| GET | /api/products | كل المنتجات |
| POST | /api/products | منتج جديد |
| PUT | /api/products/:id | تعديل منتج |
| DELETE | /api/products/:id | حذف منتج |
| GET | /api/products/stats/summary | إحصائيات |
| GET | /api/categories | الفئات |
| POST | /api/categories | فئة جديدة |
"# mafazaprod" 
"# mafazaprod" 
"# mafazaprod" 
"# mafazaprod" 
"# mafazaprod" 
"# mafazaprod" 
"# mafazaprod" 
"# mafazaprod" 
"# mafazaprod" 
"# mafazaprod" 
"# mafazasites" 
