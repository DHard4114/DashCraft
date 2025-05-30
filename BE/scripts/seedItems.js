require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const { connectDB } = require('../config/db');
const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');

async function seedItems() {
    try {
        await connectDB();
        console.log('Connected to database');

        // Drop collection completely to avoid index issues
        try {
            await mongoose.connection.db.collection('items').drop();
            console.log('Dropped items collection');
        } catch (error) {
            console.log('Items collection not found or already empty');
        }

        // Get categories
        const categories = await Category.find({});
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.code] = cat._id;
        });

        console.log('Available categories:', Object.keys(categoryMap));

        // Get a user for createdBy (you might need to create one first)
        let creator = await User.findOne({ role: 'creator' });
        if (!creator) {
            creator = await User.findOne({ role: 'admin' });
        }
        
        if (!creator) {
            console.log('No creator or admin user found. Please create a user first.');
            process.exit(1);
        }

        console.log('Using creator:', creator.username);

        const items = [
            {
                name: "DIY Recycled Paper Kit",
                slug: slugify("DIY Recycled Paper Kit", { lower: true, strict: true }),
                description: "Kit untuk membuat kertas daur ulang dari kertas bekas.",
                price: 50000,
                category: categoryMap["001"],
                difficulty: "Mudah",
                estimatedTime: "2 jam",
                materials: [
                    { name: "Kertas bekas", quantity: "20 lembar" },
                    { name: "Air", quantity: "500 ml" },
                    { name: "Blender", quantity: "1 buah" },
                    { name: "Saringan", quantity: "1 buah" }
                ],
                instructions: [
                    { step: 1, description: "Potong kecil-kecil kertas bekas." },
                    { step: 2, description: "Blender bersama air hingga menjadi bubur." },
                    { step: 3, description: "Tuangkan bubur ke saringan dan ratakan." },
                    { step: 4, description: "Keringkan hasil saringan hingga menjadi kertas." }
                ],
                tags: ["recycle", "paper", "eco"],
                status: "active",
                createdBy: creator._id,
                images: []
            },
            {
                name: "Eco Soap Making Kit",
                slug: slugify("Eco Soap Making Kit", { lower: true, strict: true }),
                description: "Kit lengkap untuk membuat sabun ramah lingkungan dari bahan alami.",
                price: 95000,
                category: categoryMap["001"], // Eco-Friendly Products
                difficulty: "Sedang",
                estimatedTime: "1.5 jam",
                materials: [
                    { name: "Minyak kelapa", quantity: "250 ml" },
                    { name: "NaOH", quantity: "50 g" },
                    { name: "Air", quantity: "100 ml" },
                    { name: "Pewangi alami", quantity: "10 ml" }
                ],
                instructions: [
                    { step: 1, description: "Campurkan NaOH dengan air (hati-hati panas)." },
                    { step: 2, description: "Campurkan larutan dengan minyak kelapa." },
                    { step: 3, description: "Aduk hingga mengental, tambahkan pewangi." },
                    { step: 4, description: "Tuang ke cetakan dan diamkan 24 jam." }
                ],
                tags: ["soap", "eco", "natural"],
                status: "active",
                createdBy: creator._id,
                images: []
            },
            {
                name: "Organic Compost Kit",
                slug: slugify("Organic Compost Kit", { lower: true, strict: true }),
                description: "Kit untuk membuat kompos dari sampah dapur.",
                price: 40000,
                category: categoryMap["002"], // Gardening & Upcycling
                difficulty: "Mudah",
                estimatedTime: "1 minggu",
                materials: [
                    { name: "Ember kompos", quantity: "1 buah" },
                    { name: "Sampah organik", quantity: "1 kg" },
                    { name: "Tanah", quantity: "500 g" }
                ],
                instructions: [
                    { step: 1, description: "Masukkan lapisan tanah ke dasar ember." },
                    { step: 2, description: "Tambahkan sampah organik secara bertahap." },
                    { step: 3, description: "Aduk setiap 2 hari." },
                    { step: 4, description: "Setelah 1 minggu, kompos siap digunakan." }
                ],
                tags: ["compost", "organic", "recycle"],
                status: "active",
                createdBy: creator._id,
                images: []
            },
            {
                name: "Plastic Bottle Planter Kit",
                slug: slugify("Plastic Bottle Planter Kit", { lower: true, strict: true }),
                description: "Kit kerajinan untuk membuat pot dari botol plastik bekas.",
                price: 30000,
                category: categoryMap["002"], // Gardening & Upcycling
                difficulty: "Mudah",
                estimatedTime: "1 jam",
                materials: [
                    { name: "Botol plastik", quantity: "2 buah" },
                    { name: "Cat akrilik", quantity: "50 ml" },
                    { name: "Pisau cutter", quantity: "1 buah" },
                    { name: "Tanah dan bibit", quantity: "secukupnya" }
                ],
                instructions: [
                    { step: 1, description: "Potong botol sesuai desain pot." },
                    { step: 2, description: "Cat botol sesuai kreativitas." },
                    { step: 3, description: "Isi dengan tanah dan tanam bibit." }
                ],
                tags: ["plastic", "plant", "recycle"],
                status: "active",
                createdBy: creator._id,
                images: []
            },
            {
                name: "Solar Oven Kit",
                slug: slugify("Solar Oven Kit", { lower: true, strict: true }),
                description: "Kit eksperimen untuk membuat oven tenaga surya dari kardus.",
                price: 85000,
                category: categoryMap["003"], // DIY Science & Innovation
                difficulty: "Sedang",
                estimatedTime: "2 jam",
                materials: [
                    { name: "Kardus", quantity: "1 buah" },
                    { name: "Aluminium foil", quantity: "1 roll" },
                    { name: "Plastik transparan", quantity: "1 lembar" },
                    { name: "Isolasi", quantity: "1 roll" }
                ],
                instructions: [
                    { step: 1, description: "Lapisi dalam kardus dengan aluminium foil." },
                    { step: 2, description: "Buat jendela plastik untuk menahan panas." },
                    { step: 3, description: "Arahkan ke matahari dan uji dengan makanan." }
                ],
                tags: ["solar", "experiment", "eco"],
                status: "active",
                createdBy: creator._id,
                images: []
            },
            {
                name: "Natural Dyes Batik Kit",
                slug: slugify("Natural Dyes Batik Kit", { lower: true, strict: true }),
                description: "Kit untuk membuat batik menggunakan pewarna alami dari tumbuhan.",
                price: 120000,
                category: categoryMap["004"], // Traditional & Artistic Crafts
                difficulty: "Sulit",
                estimatedTime: "3-4 jam",
                materials: [
                    { name: "Kain mori", quantity: "1 meter" },
                    { name: "Canting", quantity: "1 buah" },
                    { name: "Lilin batik", quantity: "100 g" },
                    { name: "Pewarna alami", quantity: "100 ml" }
                ],
                instructions: [
                    { step: 1, description: "Gambar motif di kain menggunakan canting dan lilin." },
                    { step: 2, description: "Celupkan kain ke dalam larutan pewarna alami." },
                    { step: 3, description: "Rebus kain untuk menghilangkan lilin." },
                    { step: 4, description: "Keringkan dan setrika kain batik." }
                ],
                tags: ["batik", "natural-dye", "traditional"],
                status: "active",
                createdBy: creator._id,
                images: []
            },
            {
                name: "Upcycled Paper Beads Kit",
                slug: slugify("Upcycled Paper Beads Kit", { lower: true, strict: true }),
                description: "Kit membuat manik-manik dari kertas daur ulang untuk perhiasan unik.",
                price: 52000,
                category: categoryMap["004"], // Traditional & Artistic Crafts
                difficulty: "Mudah",
                estimatedTime: "1-2 jam",
                materials: [
                    { name: "Kertas bekas", quantity: "10 lembar" },
                    { name: "Lem putih", quantity: "50 ml" },
                    { name: "Lidi atau tusuk sate", quantity: "1 batang" },
                    { name: "Tali rami", quantity: "1 meter" }
                ],
                instructions: [
                    { step: 1, description: "Potong kertas menjadi segitiga panjang." },
                    { step: 2, description: "Gulung dengan lidi, lem bagian ujungnya." },
                    { step: 3, description: "Biarkan kering dan oles pelindung jika perlu." },
                    { step: 4, description: "Rangkai menjadi gelang atau kalung." }
                ],
                tags: ["paper", "recycle", "beads"],
                status: "active",
                createdBy: creator._id,
                images: []
            }
        ];

        const createdItems = await Item.insertMany(items);
        
        // Update category item counts
        for (const item of createdItems) {
            await Category.findByIdAndUpdate(
                item.category,
                { $inc: { itemCount: 1 } }
            );
        }
        
        console.log('✅ Items created successfully:');
        createdItems.forEach(item => {
            console.log(`- ${item.name}: ${item._id}`);
            console.log(`  Slug: ${item.slug}`);
            console.log(`  Category: ${item.category}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating items:', error);
        process.exit(1);
    }
}

seedItems();
