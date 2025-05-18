import { Link } from "react-router-dom";

const Advantages = () => {
    const advantages = [
        {
            title: "Premium Materials",
            heading: "Only the finest quality ingredients",
            description:
                "We source only top-grade materials that ensure durability, vibrant colors, and professional results for all your creative endeavors.",
            cta: "Explore Materials",
            to: "/products/materials"
        },
        {
            title: "Ease of Use",
            heading: "Beginner-friendly experience",
            description:
                "Our products are designed with simplicity in mind. Clear instructions and intuitive processes make crafting accessible to everyone.",
            cta: "Try It Now",
            to: "/get-started"
        },
        {
            title: "Versatility",
            heading: "Endless creative possibilities",
            description:
                "From clothing refreshes to home decor transformations, our products adapt to numerous applications for your unique expression.",
            cta: "Get Inspired",
            to: "/inspiration"
        },
        {
            title: "Expert Support",
            heading: "Personalized guidance",
            description:
                "Our dedicated team of craft specialists is always ready to assist with questions and creative advice for perfect results.",
            cta: "Ask an Expert",
            to: "/support"
        }
    ];

    return (
        <section className="w-full bg-[#f9f7f5] py-10 sm:py-16 md:py-24 px-3 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 sm:mb-12 text-center px-1 sm:px-0">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-gray-500 mb-2 block">Why Choose Us</span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-800 tracking-wide">Our Distinctive Advantages</h2>
                    <div className="w-12 h-px bg-gray-300 mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    {advantages.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 sm:p-6 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group rounded-lg"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f5f1ea] flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#e9e4da] transition-colors duration-300">
                                <span className="text-base sm:text-lg font-light text-gray-700">{index + 1}</span>
                            </div>

                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                <h3 className="text-[9px] sm:text-xs uppercase tracking-widest font-medium text-gray-500">{item.title}</h3>
                                <h2 className="text-lg sm:text-xl font-light text-gray-800 leading-tight">{item.heading}</h2>
                                <div className="w-5 sm:w-6 h-px bg-gray-300"></div>
                                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.description}</p>
                            </div>

                            <Link
                                to={item.to}
                                className="text-[9px] sm:text-xs uppercase tracking-wider font-medium text-gray-700 hover:text-gray-900 flex items-center group-hover:translate-x-1 transition-transform duration-300"
                            >
                                {item.cta}
                                <svg
                                    className="w-3 h-3 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    ></path>
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Advantages;
