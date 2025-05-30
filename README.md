<div align="center">
  
# 🛠️ DashCraft 🛠️
### *Unleash Your Inner Artist with Premium DIY Kits*

</div>
<div align="center">
  
![DashCraft Banner](https://hackmd.io/_uploads/SJiouDVzgl.png)

</div>


## 🌟 **About DashCraft**

**DashCraft** adalah toko online terdepan yang menghadirkan koleksi lengkap DIY Kit (Do It Yourself Kit) untuk memenuhi hasrat kreatif Anda di rumah. Kami menyediakan paket-paket lengkap berisi bahan-bahan premium, alat-alat berkualitas, dan panduan tutorial yang detail dan mudah dipahami, memungkinkan siapa saja dari pemula hingga yang berpengalaman untuk menciptakan karya kerajinan tangan yang menakjubkan.

### ✨ **Why Choose DashCraft?**

<div align="justify">

| 🎯 | **Complete Packages** | Semua bahan sudah diukur dengan tepat |
|:---:|:---:|:---|
| 🎨 | **Premium Quality** | Bahan-bahan berkualitas tinggi |
| 📚 | **Easy Tutorials** | Panduan step-by-step yang mudah diikuti |
| 🌱 | **Eco-Friendly** | Komitmen pada produk ramah lingkungan |
| 🚀 | **Fast Delivery** | Pengiriman cepat ke seluruh Indonesia |

</div>
</br>

## 🛍️ **Our DIY Collection**

<div align="center">
  
<table>
<tr>
<td align="center">🧼<br><b>Organic Soap Kit</b><br>Essential oils & natural ingredients</td>
<td align="center">🕯️<br><b>Aromatherapy Candles</b><br>Natural wax & premium scents</td>
<td align="center">👜<br><b>Fashion Accessories</b><br>Bags, jewelry & more</td>
</tr>
<tr>
<td align="center">♻️<br><b>Upcycling Projects</b><br>Turn waste into wonder</td>
<td align="center">🌿<br><b>Mini Garden Kits</b><br>Indoor plants & herbs</td>
<td align="center">🔨<br><b>Woodworking</b><br>Simple home decor projects</td>
</tr>
</table>

</div>
</br>

## 🛠️ **Tech Stack**

<div align="center">

### 🔧 Frontend Technologies
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

## 🚀 **Quick Start Guide**

### 📥 **Clone the Repository**
```bash
git clone https://github.com/DHard4114/DashCraft.git
cd DashCraft
```


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

### ⚙️ **Frontend Setup**
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
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── auth/
│   │   ├── AuthModal.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── components/
│   │   ├── BrandValueSlider.jsx
│   │   ├── DotIndicators.jsx
│   │   ├── Footer.jsx
│   │   ├── ImageGallery.jsx
│   │   ├── Layout.jsx
│   │   ├── NavBar.jsx
│   │   ├── PaymentModal.jsx
│   │   ├── productCard.jsx
│   │   ├── ProductDetailModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── scrollButton.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useCarousel.js
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Advantages.jsx
│   │   ├── BuyOnline.jsx
│   │   ├── CartPage.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── paymentMethod.jsx
│   │   └── ProductGrid.jsx
│   ├── products/
│   │   └── material/
│   │       └── Material.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vercel.json
└── vite.config.js

```

## **Authors ✍️** 
| K2 Group 13 | NPM |
| :----------------: | :------------: |
| [**Daffa Hardhan**](https://github.com/DHard4114)| 2306161763 |
| [**Muhammad Rafli**](https://github.com/MRafli127)| 2306250730 |
| [**Ekananda Zhafif Dean**](https://github.com/RubenKristanto)| 2306264420 |

