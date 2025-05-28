
const ProductCard = ({ product }) => {
    const imageUrl = product.imageUrl ;
    
    return (
        <div className="flex-shrink-0 w-[225px] bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name || 'Product'}
                    className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-4 font-mono">
                <h3 className="text-sm font-light tracking-wide">{product.name || 'Unnamed Product'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                    {typeof product.price === 'number'
                        ? `Rp${product.price.toLocaleString('id-ID')}`
                        : product.price || 'Price unavailable'}
                </p>
                <button className="mt-3 text-xs px-4 py-2 border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50 transition-colors duration-300">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ProductCard;