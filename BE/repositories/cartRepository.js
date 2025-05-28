const Cart = require('../models/cartModel');
const Item = require('../models/itemModel');

class CartRepository {
  async getCart(customerId) {
    try {
      let cart = await Cart.findOne({ 
        customer: customerId,
        status: 'active' 
      }).populate('items.item');
      
      if (!cart) {
        cart = new Cart({ customer: customerId });
        await cart.save();
      }
      return { success: true, data: cart };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async addItem(customerId, itemId, quantity) {
    try {
      const item = await Item.findById(itemId);
      if (!item) return { success: false, message: 'Item not found' };

      let cart = await Cart.findOne({ customer: customerId, status: 'active' });
      if (!cart) {
        cart = new Cart({ customer: customerId });
      }

      const existingItem = cart.items.find(i => i.item.toString() === itemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          item: itemId,
          quantity,
          priceAtAddition: item.price
        });
      }

      cart.total = cart.items.reduce((sum, item) => 
        sum + (item.priceAtAddition * item.quantity), 0
      );
      await cart.save();
      return { success: true, data: cart };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateQuantity(customerId, itemId, quantity) {
    try {
      const cart = await Cart.findOne({ customer: customerId, status: 'active' });
      if (!cart) return { success: false, message: 'Cart not found' };

      const item = cart.items.find(i => i.item.toString() === itemId);
      if (!item) return { success: false, message: 'Item not found in cart' };

      item.quantity = quantity;
      cart.total = cart.items.reduce((sum, item) => 
        sum + (item.priceAtAddition * item.quantity), 0
      );
      await cart.save();
      return { success: true, data: cart };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async removeItem(customerId, itemId) {
    try {
      const cart = await Cart.findOne({ customer: customerId, status: 'active' });
      if (!cart) return { success: false, message: 'Cart not found' };

      cart.items = cart.items.filter(item => item.item.toString() !== itemId);
      cart.total = cart.items.reduce((sum, item) => 
        sum + (item.priceAtAddition * item.quantity), 0
      );
      await cart.save();
      return { success: true, data: cart };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new CartRepository();