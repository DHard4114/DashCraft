
const ScrollButton = ({ direction, onClick }) => {
    const isLeft = direction === 'left';
    return (
        <button
            onClick={onClick}
            className={`absolute ${isLeft ? 'left-0 -ml-4' : 'right-0 -mr-4'} top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300`}
            aria-label={isLeft ? "Previous item" : "Next item"}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d={isLeft
                    ? "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                    : "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"}
                />
            </svg>
        </button>
    );
};

export default ScrollButton;
