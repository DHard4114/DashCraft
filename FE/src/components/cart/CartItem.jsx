import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { updateCartItem, removeFromCart } from '../../services/cartService';

const CartItem = ({ item, onUpdate }) => {
  const handleQuantityChange = async (change) => {
    try {
      const newQuantity = item.quantity + change;
      if (newQuantity < 1) return;
      
      await updateCartItem(item.item._id, newQuantity);
      onUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.item._id);
      onUpdate();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <img
        src={item.item.image}
        alt={item.item.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{item.item.name}</h3>
        <p className="text-gray-600">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(item.priceAtAddition)}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={handleRemove}
          className="ml-4 p-1 hover:bg-red-100 rounded text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;