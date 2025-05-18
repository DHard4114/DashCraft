const Advantages = () => {
    const advantages = [
        {
            title: "Premium Materials",
            heading: "Only the finest quality ingredients",
            description: "We source only top-grade materials that ensure durability, vibrant colors, and professional results for all your creative endeavors."
        },
        {
            title: "Ease of Use",
            heading: "Beginner-friendly experience",
            description: "Our products are designed with simplicity in mind. Clear instructions and intuitive processes make crafting accessible to everyone."
        },
        {
            title: "Versatility",
            heading: "Endless creative possibilities",
            description: "From clothing refreshes to home decor transformations, our products adapt to numerous applications for your unique expression."
        },
        {
            title: "Expert Support",
            heading: "Personalized guidance",
            description: "Our dedicated team of craft specialists is always ready to assist with questions and creative advice for perfect results."
        }
    ];

    return (
        <section className="w-full bg-[#f9f7f5] py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-16 text-center">
                    <span className="text-xs uppercase tracking-widest font-medium text-gray-500 mb-3 block">Why Choose Us</span>
                    <h2 className="text-3xl font-light text-gray-800 tracking-wide">Our Distinctive Advantages</h2>
                    <div className="w-16 h-px bg-gray-300 mx-auto mt-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {advantages.map((item, index) => (
                        <div key={index} className="bg-white p-10 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-full bg-[#f5f1ea] flex items-center justify-center mb-8 group-hover:bg-[#e9e4da] transition-colors duration-300">
                                <span className="text-xl font-light text-gray-700">{index + 1}</span>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <h3 className="text-xs uppercase tracking-widest font-medium text-gray-500">{item.title}</h3>
                                <h2 className="text-2xl font-light text-gray-800 leading-tight">{item.heading}</h2>
                                <div className="w-8 h-px bg-gray-300"></div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                            
                            <button className="text-xs uppercase tracking-wider font-medium text-gray-700 hover:text-gray-900 flex items-center group-hover:translate-x-1 transition-transform duration-300">
                                Discover
                                <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Advantages;