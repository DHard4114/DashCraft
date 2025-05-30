# 🛠️ DashCraft
### *Unleash Your Inner Artist with Premium DIY Kits*

<div align="center">
  
![DashCraft Banner](https://hackmd.io/_uploads/SJiouDVzgl.png)

</div>

<br>

---

<br>

## 🌟 **About DashCraft**

**DashCraft** adalah toko online terdepan yang menghadirkan koleksi lengkap **DIY Kit (Do It Yourself Kit)** untuk memenuhi hasrat kreatif Anda di rumah. Kami menyediakan paket-paket lengkap berisi bahan-bahan premium, alat-alat berkualitas, dan panduan tutorial yang detail dan mudah dipahami.

<br>

### ✨ **Why Choose DashCraft?**

<div align="center">

| 🎯 | **Complete Packages** | Semua bahan sudah diukur dengan tepat |
|:---:|:---:|:---|
| 🎨 | **Premium Quality** | Bahan-bahan berkualitas tinggi |
| 📚 | **Easy Tutorials** | Panduan step-by-step yang mudah diikuti |
| 🌱 | **Eco-Friendly** | Komitmen pada produk ramah lingkungan |
| 🚀 | **Fast Delivery** | Pengiriman cepat ke seluruh Indonesia |

</div>

<br>

---

<br>

## 🛍️ **Our Premium DIY Collection**

<div align="center">

<table>
<tr>
<td align="center" width="250px" style="padding: 20px;">
<h3>🧼</h3>
<b>Organic Soap Kit</b><br>
<i>Essential oils & natural ingredients</i>
</td>
<td align="center" width="250px" style="padding: 20px;">
<h3>🕯️</h3>
<b>Aromatherapy Candles</b><br>
<i>Natural wax & premium scents</i>
</td>
<td align="center" width="250px" style="padding: 20px;">
<h3>👜</h3>
<b>Fashion Accessories</b><br>
<i>Bags, jewelry & more</i>
</td>
</tr>
<tr>
<td align="center" width="250px" style="padding: 20px;">
<h3>♻️</h3>
<b>Upcycling Projects</b><br>
<i>Turn waste into wonder</i>
</td>
<td align="center" width="250px" style="padding: 20px;">
<h3>🌿</h3>
<b>Mini Garden Kits</b><br>
<i>Indoor plants & herbs</i>
</td>
<td align="center" width="250px" style="padding: 20px;">
<h3>🔨</h3>
<b>Woodworking</b><br>
<i>Simple home decor projects</i>
</td>
</tr>
</table>

</div>

<br>

---

<br>

## 🛠️ **Tech Stack**

<div align="center">

### 🎨 Frontend Technologies
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### ⚙️ Backend Technologies
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### ☁️ Cloud & Tools
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

<br>

---

<br>

## 🚀 **Quick Start Guide**

### 📥 **Clone the Repository**
```bash
git clone https://github.com/DHard4114/DashCraft.git
cd DashCraft
```

<br>

### 🔧 **Backend Setup**
```bash
cd BE
npm install
npm run start
```

<details>
<summary>📁 <b>View Backend Structure</b></summary>

<br>

```
BE/
├── 🔧 config/
│   └── db.js                    # Database configuration
├── 🛡️ middleware/
│   ├── authMiddleware.js        # Authentication middleware
│   ├── corsMiddleware.js        # CORS configuration
│   ├── errorMiddleware.js       # Error handling
│   ├── roleMiddleware.js        # Role-based access
│   └── validationMiddleware.js  # Input validation
├── 📊 models/
│   ├── cartModel.js            # Shopping cart model
│   ├── categoryModel.js        # Product categories
│   ├── itemModel.js            # Product items
│   ├── orderModel.js           # Order management
│   └── userModel.js            # User management
├── 🗄️ repositories/
│   ├── cartRepository.js       # Cart data operations
│   ├── itemRepository.js       # Item data operations
│   ├── orderRepository.js      # Order data operations
│   └── userRepository.js       # User data operations
├── 🛤️ routes/
│   ├── cartRoute.js           # Cart API endpoints
│   ├── itemRoute.js           # Item API endpoints
│   ├── orderRoute.js          # Order API endpoints
│   └── userRoute.js           # User API endpoints
├── ⚙️ utils/
│   ├── cloudinary.js          # Image upload service
│   └── multer.js              # File upload handling
└── 🚀 server.js               # Main server file
```

</details>

<br>

### 🎨 **Frontend Setup**
```bash
cd FE
npm install
npm install lucide-react
npm run dev
```

<details>
<summary>📁 <b>View Frontend Structure</b></summary>

<br>

```
FE/
├── 🎨 src/
│   ├── 🔐 auth/
│   │   ├── AuthModal.jsx       # Authentication modal
│   │   ├── Login.jsx           # Login component
│   │   └── Register.jsx        # Registration component
│   ├── 🧩 components/
│   │   ├── NavBar.jsx          # Navigation bar
│   │   ├── Footer.jsx          # Footer component
│   │   ├── ProductCard.jsx     # Product display card
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   └── ...more components
│   ├── 📄 pages/
│   │   ├── Home.jsx            # Homepage
│   │   ├── BuyOnline.jsx       # Shopping page
│   │   ├── CartPage.jsx        # Shopping cart
│   │   └── Contact.jsx         # Contact page
│   ├── 🎯 contexts/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── 🪝 hooks/
│   │   └── useCarousel.js      # Custom carousel hook
│   └── 📱 assets/              # Static assets
└── 📦 package.json             # Dependencies
```

</details>

<br>

---

<br>

## ✨ **Key Features**

<div align="center">

| Feature | Description | Status |
|:-------:|:------------|:------:|
| 🛒 **Shopping Cart** | Add, remove, and manage DIY kits | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| 👤 **User Authentication** | Secure login and registration | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| 💳 **Payment Integration** | Multiple payment methods | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| 📱 **Responsive Design** | Works on all devices | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| 🔍 **Product Search** | Find your perfect DIY kit | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| ⭐ **Reviews & Ratings** | Customer feedback system | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |

</div>

<br>

---

<br>

## 👥 **Meet Our Creative Team**

<div align="center">

### 🎓 **K2 Group 13** - *Crafting Digital Excellence*

<br>

<table>
<tr>
<td align="center" width="280px" style="padding: 25px; border: 1px solid #e1e5e9; border-radius: 12px;">
<img src="https://github.com/DHard4114.png" width="100px" alt="Daffa Hardhan" style="border-radius: 50%; border: 3px solid #f39c12;"/><br><br>
<h3>✨ Daffa Hardhan</h3>
<a href="https://github.com/DHard4114">
<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a><br><br>
<code>📚 NPM: 2306161763</code>
</td>
<td align="center" width="280px" style="padding: 25px; border: 1px solid #e1e5e9; border-radius: 12px;">
<img src="https://github.com/MRafli127.png" width="100px" alt="Muhammad Rafli" style="border-radius: 50%; border: 3px solid #3498db;"/><br><br>
<h3>⭐ Muhammad Rafli</h3>
<a href="https://github.com/MRafli127">
<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a><br><br>
<code>📚 NPM: 2306250730</code>
</td>
<td align="center" width="280px" style="padding: 25px; border: 1px solid #e1e5e9; border-radius: 12px;">
<img src="https://github.com/Ekazadex.png" width="100px" alt="Ekananda Zhafif Dean" style="border-radius: 50%; border: 3px solid #27ae60;"/><br><br>
<h3>🌟 Ekananda Zhafif D</h3>
<a href="https://github.com/Ekazadex">
<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a><br><br>
<code>📚 NPM: 2306264420</code>
</td>
</tr>
</table>

<br>

*"Passionate developers united by the vision of empowering creativity through technology"*⚡

</div>

<br>

---

<br>

### 🐛 **Found a Bug?**
Please open an issue with detailed information about the bug and steps to reproduce it.

### 💡 **Have an Idea?**
We'd love to hear your suggestions! Open an issue to discuss new features.

<br>

---

<br>

<div align="center">

### 🌟 **Show Your Support**

If you found this project helpful, please consider giving it a star! ⭐

[![GitHub stars](https://img.shields.io/github/stars/DHard4114/DashCraft?style=for-the-badge&logo=github)](https://github.com/DHard4114/DashCraft/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/DHard4114/DashCraft?style=for-the-badge&logo=github)](https://github.com/DHard4114/DashCraft/issues)

<br>

---

<br>

**Made by K2 Group 13**

*Empowering creativity, one DIY kit at a time* ✨

### 🔗 **Quick Links**
[🏠 Homepage](https://dashcraft-demo.vercel.app) • [📖 Documentation](https://github.com/DHard4114/DashCraft/wiki) • [🐛 Report Bug](https://github.com/DHard4114/DashCraft/issues) • [💡 Request Feature](https://github.com/DHard4114/DashCraft/issues)

</div>
