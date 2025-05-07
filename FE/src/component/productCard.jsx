
import React from 'react';

const productCard = ({ card, index }) => {
    return (
        <section key={index} className="max-w-[1280px] mx-auto my-10 animate-fadeIn">
        <div
            className={`max-w-[1080px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-10 ${
            index % 2 !== 0 ? 'md:flex-row-reverse' : ''
            }`}
        >
            {/* Gambar */}
            <a href={card.link} target="_self" className="relative block w-full md:w-1/2 group">
            <div className="relative w-full pb-[56.25%]">
                {/* Layer bawah */}
                <div className="absolute inset-0 bg-sky-100 translate-x-4 translate-y-4"></div>

                {/* Gambar utama */}
                <div
                className="absolute inset-0 bg-cover bg-center shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1"
                style={{ backgroundImage: `url(${card.image})` }}
                ></div>
            </div>
            </a>

            {/* Deskripsi */}
            <div className="flex-1 px-4 md:px-0 font-mono">
            <div className="mb-4 text-lg font-mono text-black hover:underline transition">
                <a href={card.link} target="_self">{card.title}</a>
            </div>

            <div className="text-gray-700 text-base leading-relaxed">
                <p>{card.description}</p>
            </div>
            </div>
        </div>
        </section>
    );
};

export default productCard;
