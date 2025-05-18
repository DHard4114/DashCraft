const Modal = ({ onClose, title, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{title}</h2>
            <button onClick={onClose}>X</button>
            </div>
            {children}
        </div>
        </div>
    );
};

export default Modal;
