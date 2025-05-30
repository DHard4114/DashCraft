<h1 align="center">DashCraft</h1>

<p align="center">
  <img src="https://hackmd.io/_uploads/SJiouDVzgl.png" alt="Image" width="900">
</p>

**DashCraft** adalah toko online terdepan yang menghadirkan koleksi lengkap DIY Kit (Do It Yourself Kit) untuk memenuhi hasrat kreatif Anda di rumah. Kami menyediakan paket-paket lengkap berisi bahan-bahan premium, alat-alat berkualitas, dan panduan tutorial yang detail dan mudah dipahami, memungkinkan siapa saja dari pemula hingga yang berpengalaman untuk menciptakan karya kerajinan tangan yang menakjubkan.

Koleksi DIY Kit kami sangat beragam, mulai dari pembuatan sabun organik dengan essential oil pilihan, lilin aromaterapi dengan wangi natural, kit menjahit tas dan aksesori fashion, kerajinan kerdaur ulang yang ramah lingkungan, pembuatan perhiasan handmade, kit berkebun mini untuk tanaman hias, hingga proyek woodworking sederhana untuk dekorasi rumah. Setiap kit dilengkapi dengan bahan-bahan yang sudah diukur dengan tepat, tools yang dibutuhkan, serta booklet panduan bergambar yang mudah diikuti langkah demi langkah.

**DashCraft** percaya bahwa aktivitas DIY bukan hanya sekedar hobi, tetapi juga terapi kreatif yang dapat mengurangi stress, meningkatkan fokus, dan memberikan kepuasan tersendiri ketika melihat hasil karya sendiri. Kami berkomitmen mendukung gaya hidup kreatif dan sustainable dengan menyediakan bahan-bahan eco-friendly dan kemasan yang dapat didaur ulang.

Dengan layanan pengiriman cepat, customer service yang responsif, dan jaminan kualitas produk, **DashCraft** menjadi partner terpercaya bagi komunitas DIY enthusiast di seluruh Indonesia. Mari wujudkan ide kreatif Anda bersama DashCraft - tempat di mana setiap orang bisa menjadi craftsperson handal!

## 🛠️Tech Stack

![image](https://hackmd.io/_uploads/H1lv0v4Mge.png)![image](https://hackmd.io/_uploads/S1WjRP4fee.png)![image](https://hackmd.io/_uploads/BJpsRPEfxg.png)![image](https://hackmd.io/_uploads/rywpCwEMgx.png)![image](https://hackmd.io/_uploads/Bkn6CwVGle.png)![image](https://hackmd.io/_uploads/SyuRRDNfgl.png)![image](https://hackmd.io/_uploads/HJk1yu4fxg.png)![image](https://hackmd.io/_uploads/HytyJOEzlg.png)![image](https://hackmd.io/_uploads/HkNLJOEMlg.png)![image](https://hackmd.io/_uploads/HJjwJOVMlg.png)

## Installation Guide

```
git clone https://github.com/DHard4114/DashCraft.git
```

### Backend

```
cd BE
npm install
npm run start
```

- **Stucture File Backend**
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

- **Stucture File Frontend**
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
| [**Ekananda Zhafif Dean**](https://github.com/Ekazadex)| 2306264420 |
