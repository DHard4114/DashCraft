const DotIndicators = ({ total, currentIndex, onClick }) => (
    <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: total }).map((_, i) => (
            <button
                key={i}
                onClick={() => onClick(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === i
                        ? 'bg-gray-500 scale-125'
                        : 'bg-gray-200 hover:bg-gray-300'
                } focus:outline-none`}
                aria-label={`Go to item ${i + 1}`}
                aria-current={currentIndex === i ? 'true' : 'false'}
            />
        ))}
    </div>
);

export default DotIndicators;
