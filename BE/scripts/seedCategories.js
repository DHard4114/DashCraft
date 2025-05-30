require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const { connectDB } = require('../config/db');
const Category = require('../models/categoryModel');

async function seedCategories() {
    try {
        await connectDB();
        console.log('Connected to database');
        
        // Drop collection completely to avoid index issues
        try {
            await mongoose.connection.db.collection('categories').drop();
            console.log('Dropped categories collection');
        } catch (error) {
            console.log('Collection not found or already empty');
        }
        
        const categories = [
            {
                name: "Eco-Friendly Products",
                slug: slugify("Eco-Friendly Products", { lower: true, strict: true }),
                code: "001",
                description: "Produk ramah lingkungan dan berkelanjutan untuk kehidupan yang lebih hijau",
                icon: "fa-leaf",
                theme: "eco-friendly",
                materials: [
                    {
                        name: "Recycled Paper",
                        description: "Kertas daur ulang untuk berbagai proyek kreatif dan ramah lingkungan",
                        properties: ["biodegradable", "recyclable", "eco-friendly"],
                        uses: ["paper making", "crafting", "packaging"],
                        sustainability: "high"
                    },
                    {
                        name: "Natural Oils",
                        description: "Minyak alami untuk pembuatan sabun dan produk perawatan",
                        properties: ["natural", "moisturizing", "chemical-free"],
                        uses: ["soap making", "cosmetics", "aromatherapy"],
                        sustainability: "high"
                    },
                    {
                        name: "Organic Waste",
                        description: "Sampah organik untuk kompos dan pertanian berkelanjutan",
                        properties: ["biodegradable", "nutrient-rich", "natural"],
                        uses: ["composting", "soil enhancement", "gardening"],
                        sustainability: "high"
                    }
                ]
            },
            {
                name: "Gardening & Upcycling",
                slug: slugify("Gardening & Upcycling", { lower: true, strict: true }),
                code: "002", 
                description: "Kerajinan untuk berkebun dan mendaur ulang barang bekas",
                icon: "fa-seedling",
                theme: "upcycling",
                materials: [
                    {
                        name: "Plastic Containers",
                        description: "Container plastik bekas untuk pot tanaman dan storage",
                        properties: ["durable", "waterproof", "lightweight"],
                        uses: ["planters", "storage", "garden containers"],
                        sustainability: "medium"
                    },
                    {
                        name: "Organic Soil",
                        description: "Tanah organik untuk pertumbuhan tanaman yang sehat",
                        properties: ["nutrient-rich", "organic", "fertile"],
                        uses: ["planting", "gardening", "composting"],
                        sustainability: "high"
                    }
                ]
            },
            {
                name: "DIY Science & Innovation",
                slug: slugify("DIY Science & Innovation", { lower: true, strict: true }),
                code: "003",
                description: "Proyek sains dan inovasi teknologi ramah lingkungan",
                icon: "fa-flask",
                theme: "natural-materials", // Use valid theme
                materials: [
                    {
                        name: "Cardboard",
                        description: "Kardus untuk eksperimen dan konstruksi ringan",
                        properties: ["lightweight", "recyclable", "versatile"],
                        uses: ["solar ovens", "furniture", "experiments"],
                        sustainability: "high"
                    },
                    {
                        name: "Aluminum Foil",
                        description: "Foil aluminium untuk refleksi dan insulasi termal",
                        properties: ["reflective", "heat-conductive", "malleable"],
                        uses: ["solar projects", "insulation", "crafting"],
                        sustainability: "medium"
                    }
                ]
            },
            {
                name: "Traditional & Artistic Crafts",
                slug: slugify("Traditional & Artistic Crafts", { lower: true, strict: true }),
                code: "004",
                description: "Kerajinan tradisional dan seni kreatif",
                icon: "fa-palette",
                theme: "traditional-crafts",
                materials: [
                    {
                        name: "Natural Dyes",
                        description: "Pewarna alami dari tumbuhan untuk batik dan tekstil",
                        properties: ["natural", "plant-based", "vibrant"],
                        uses: ["batik", "textile dyeing", "traditional crafts"],
                        sustainability: "high"
                    },
                    {
                        name: "Cotton Fabric",
                        description: "Kain katun untuk batik dan kerajinan tekstil",
                        properties: ["soft", "breathable", "absorbent"],
                        uses: ["batik", "clothing", "home textiles"],
                        sustainability: "high"
                    },
                    {
                        name: "Paper Materials",
                        description: "Bahan kertas untuk kerajinan dan perhiasan unik",
                        properties: ["lightweight", "flexible", "colorful"],
                        uses: ["beads making", "decoration", "jewelry"],
                        sustainability: "high"
                    }
                ]
            }
        ];

        const createdCategories = await Category.insertMany(categories);
        
        console.log('✅ Categories with materials created successfully:');
        createdCategories.forEach(cat => {
            console.log(`- ${cat.name} (${cat.code}): ${cat._id}`);
            console.log(`  Slug: ${cat.slug}`);
            console.log(`  Theme: ${cat.theme}`);
            console.log(`  Materials: ${cat.materials.length} items`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating categories:', error);
        process.exit(1);
    }
}

seedCategories();