import React from "react";

const materials = [
  {
    name: "Cotton Fabric",
    description: "Soft, breathable, and perfect for wearable crafts, home textiles, and eco-friendly projects.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Cotton_boll_nearly_ready_for_harvest.jpg/640px-Cotton_boll_nearly_ready_for_harvest.jpg",
  },
  {
    name: "Canvas",
    description: "Heavy-duty woven fabric ideal for painting, tote bags, and structured crafts.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sun-shield_%28AM_1930.257-2%29.jpg/640px-Sun-shield_%28AM_1930.257-2%29.jpg",
  },
  {
    name: "Bamboo Sheets",
    description: "Sustainable and flexible material suitable for weaving, carving, or eco-designs.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Bambusholz_007.JPG/640px-Bambusholz_007.JPG",
  },
  {
    name: "Seashell Fragments",
    description: "Natural shell pieces great for jewelry, mosaics, and decorative embellishments.",
    image: "https://media.sciencephoto.com/image/c0072580/800wm/C0072580-Shell_fragments.jpg",
  },
  {
    name: "Premium Resin Kit",
    description: "Crystal-clear, durable resin perfect for artistic casting, jewelry, and protective coatings.",
    image: "https://s.alicdn.com/@sc04/kf/H552114e38e0a4bbdb28d1871e8774d11A.png_720x720q50.png",
  },
  {
    name: "Natural Dyes",
    description: "Plant-based and mineral-derived colorants for dyeing fabrics naturally.",
    image: "https://heenaagrima.com/cdn/shop/collections/IMG_6819.jpg?v=1709800398",
  },
  {
    name: "Acrylic Paint Set",
    description: "Versatile, vibrant, and fast-drying paint ideal for fabric, wood, canvas, and paper.",
    image: "https://m.media-amazon.com/images/I/71zK0wesLZL.jpg",
  },
  {
    name: "Coconut Shell Pieces",
    description: "Lightweight and rustic material used for buttons, jewelry, and décor elements.",
    image: "https://www.easyayurveda.com/wp-content/uploads/2016/09/Coconut-shell-pieces1.jpg",
  },
];

const MaterialsPage = () => {
  return (
    <section className="w-full bg-[#f9f7f5] py-6 sm:py-12 px-2 sm:px-4 lg:px-16">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
            <span className="text-[9px] sm:text-xs uppercase tracking-widest font-medium text-gray-500 mb-2 block">
                Explore Our Materials
            </span>
            <h1 className="text-lg sm:text-2xl md:text-4xl font-light text-gray-800 tracking-wide leading-snug">
                Craft Starts with Quality
            </h1>
            <div className="w-10 sm:w-12 h-px bg-gray-300 mx-auto mt-3"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {materials.map((material, index) => (
                <div
                key={index}
                className="bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                >
                <div className="aspect-[4/3] overflow-hidden">
                    <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                </div>
                <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-light text-gray-800">
                    {material.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-snug sm:leading-relaxed">
                    {material.description}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </div>
    </section>
  );
};

export default MaterialsPage;
