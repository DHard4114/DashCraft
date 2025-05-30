<h1 align="center">DashCraft</h1>

<p align="center">
  <img src="https://hackmd.io/_uploads/SJiouDVzgl.png" alt="Image" width="900">
</p>

DashCraft adalah toko online yang menghadirkan beragam kerajinan tangan unik dan berkualitas tinggi. Kami menggabungkan kreativitas tradisional dengan sentuhan modern untuk menyediakan produk-produk handcrafted yang istimewa, mulai dari dekorasi rumah, aksesori fashion, hingga hadiah personal yang penuh makna. DashCraft berkomitmen mendukung para pengrajin lokal dengan memberikan platform bagi karya mereka agar dapat dinikmati oleh pelanggan di seluruh dunia. Dengan layanan yang mudah, aman, dan cepat, DashCraft menjadi destinasi utama bagi para pencinta kerajinan tangan yang menginginkan produk autentik dan bernilai seni tinggi.

## 🛠️Tech Stack

![image](https://hackmd.io/_uploads/H1lv0v4Mge.png)![image](https://hackmd.io/_uploads/S1WjRP4fee.png)![image](https://hackmd.io/_uploads/BJpsRPEfxg.png)![image](https://hackmd.io/_uploads/rywpCwEMgx.png)![image](https://hackmd.io/_uploads/Bkn6CwVGle.png)![image](https://hackmd.io/_uploads/SyuRRDNfgl.png)![image](https://hackmd.io/_uploads/HJk1yu4fxg.png)![image](https://hackmd.io/_uploads/HytyJOEzlg.png)![image](https://hackmd.io/_uploads/HkNLJOEMlg.png)![image](https://hackmd.io/_uploads/HJjwJOVMlg.png)

## Installation Guide

```
git clone https://github.com/DHard4114/DashCraft.git
```

### Beckend

```
cd BE
npm install
npm run start
```

- Stucture File Backend
```
BE/
├── config/
│   └── db.js
├── middleware/
│   ├── authMiddleware.js
│   ├── corsMiddleware.js
│   ├── errorMiddleware.js
│   ├── roleMiddleware.js
│   └── validationMiddleware.js
├── models/
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── couponModel.js
│   ├── itemModel.js
│   ├── orderModel.js
│   ├── paymentModel.js
│   ├── reviewModel.js
│   ├── userModel.js
│   └── wishlistModel.js
├── repositories/
│   ├── cartRepository.js
│   ├── categoryRepository.js
│   ├── itemRepository.js
│   ├── orderRepository.js
│   ├── paymentRepository.js
│   ├── reviewRepository.js
│   └── userRepository.js
├── routes/
│   ├── cartRoute.js
│   ├── categoryRoute.js
│   ├── itemRoute.js
│   ├── orderRoute.js
│   ├── paymentRoute.js
│   ├── reviewRoute.js
│   └── userRoute.js
├── utils/
│   ├── cloudinary.js
│   └── multer.js
├── .dockerignore
├── .env
├── CACHED
├── Dockerfile
├── ERROR
├── package-lock.json
├── package.json
└── server.js
```

### Frontend
```
cd FE
npm install
npm install lucide-react
npm run dev
```
![image](https://hackmd.io/_uploads/SkMArvEGll.png)
- Stucture File Frontend

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

