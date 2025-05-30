import React, { useState, useEffect } from 'react';
import { X, CreditCard, Building, Smartphone, CheckCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSubmit, orderSummary }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    
    // Shipping Address - FIXED: Use consistent field names
    address: '',
    city: '',
    state: '', // Will be mapped to province in CartPage
    zipCode: '', // Will be mapped to postalCode in CartPage
    country: 'Indonesia',
    
    // Payment Details
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Bank Transfer
    bankAccount: '',
    
    // E-Wallet
    walletNumber: ''
  });

  // FIXED: Add error state and validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FIXED: Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // FIXED: Validate orderSummary prop
  const safeOrderSummary = {
    items: orderSummary?.items || [],
    subtotal: orderSummary?.subtotal || 0,
    shipping: orderSummary?.shipping || 0,
    tax: orderSummary?.tax || 0,
    discount: orderSummary?.discount || 0,
    total: orderSummary?.total || 0
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // FIXED: Update validation to use correct field names
  const validateForm = () => {
    const newErrors = {};

    // Personal Information
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Shipping Address
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required';

    // Payment Details Validation
    if (paymentMethod === 'credit_card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    } else if (paymentMethod === 'bank_transfer') {
      if (!formData.bankAccount) newErrors.bankAccount = 'Please select a bank';
    } else if (paymentMethod === 'e_wallet') {
      if (!formData.walletNumber.trim()) newErrors.walletNumber = 'Wallet number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const paymentData = {
        method: paymentMethod,
        amount: safeOrderSummary.total,
        // FIXED: Use consistent field structure
        address: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state, // Will be mapped to province in CartPage
          zipCode: formData.zipCode, // Will be mapped to postalCode in CartPage
          country: formData.country
        },
        paymentDetails: getPaymentDetails(),
        notes: formData.notes || ''
      };
      
      console.log('Payment data being sent:', JSON.stringify(paymentData, null, 2));
      
      await onSubmit(paymentData);
    } catch (error) {
      console.error('Payment submission error:', error);
      setErrors({ general: 'Payment failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardName: formData.cardName
        };
      case 'bank_transfer':
        return {
          bankAccount: formData.bankAccount
        };
      case 'e_wallet':
        return {
          walletNumber: formData.walletNumber
        };
      default:
        return {};
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return 'Rp0';
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building,
      description: 'BCA, Mandiri, BNI, BRI'
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      icon: Smartphone,
      description: 'GoPay, OVO, DANA'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-none">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="font-cookie text-3xl font-light text-gray-900">Checkout</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            
            {/* Payment Form */}
            <div className="space-y-6">
              
              {/* FIXED: Add general error display */}
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-none">
                  <p className="font-lato text-red-600 text-sm">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Information */}
                <div>
                  <h3 className="font-lato text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 font-lato text-red-600 text-sm">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 font-lato text-red-600 text-sm">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 font-lato text-red-600 text-sm">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address - FIXED: Use correct field names */}
                <div>
                  <h3 className="font-lato text-lg font-medium mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <div>
                      <textarea
                        name="address"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato resize-none ${
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-1 font-lato text-red-600 text-sm">{errors.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                            errors.city ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-1 font-lato text-red-600 text-sm">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="state"
                          placeholder="State/Province"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                            errors.state ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.state && (
                          <p className="mt-1 font-lato text-red-600 text-sm">{errors.state}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP/Postal Code"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                          errors.zipCode ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.zipCode && (
                        <p className="mt-1 font-lato text-red-600 text-sm">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="font-lato text-lg font-medium mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 border rounded-none cursor-pointer transition-colors ${
                            paymentMethod === method.id
                              ? 'border-black bg-gray-50'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                          />
                          <IconComponent className="w-5 h-5 ml-3 text-gray-600" />
                          <div className="ml-3">
                            <div className="font-lato font-medium">{method.name}</div>
                            <div className="font-lato text-sm text-gray-600">{method.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h3 className="font-lato text-lg font-medium mb-4">Payment Details</h3>
                  
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Card Number"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 font-lato text-red-600 text-sm">{errors.cardNumber}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                              errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.expiryDate && (
                            <p className="mt-1 font-lato text-red-600 text-sm">{errors.expiryDate}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                              errors.cvv ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.cvv && (
                            <p className="mt-1 font-lato text-red-600 text-sm">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Cardholder Name"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                            errors.cardName ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardName && (
                          <p className="mt-1 font-lato text-red-600 text-sm">{errors.cardName}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'bank_transfer' && (
                    <div>
                      <select
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                          errors.bankAccount ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Bank</option>
                        <option value="bca">BCA</option>
                        <option value="mandiri">Mandiri</option>
                        <option value="bni">BNI</option>
                        <option value="bri">BRI</option>
                      </select>
                      {errors.bankAccount && (
                        <p className="mt-1 font-lato text-red-600 text-sm">{errors.bankAccount}</p>
                      )}
                    </div>
                  )}
                  
                  {paymentMethod === 'e_wallet' && (
                    <div>
                      <input
                        type="text"
                        name="walletNumber"
                        placeholder="Wallet Phone Number"
                        value={formData.walletNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-1 focus:ring-black font-lato ${
                          errors.walletNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.walletNumber && (
                        <p className="mt-1 font-lato text-red-600 text-sm">{errors.walletNumber}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-black text-white rounded-none hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-lato flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Complete Order
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-none">
                <h3 className="font-lato text-lg font-medium mb-4">Order Summary</h3>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {safeOrderSummary.items.length > 0 ? (
                    safeOrderSummary.items.map((item, index) => (
                      <div key={item._id || index} className="flex items-center gap-3">
                        <img
                          src={item?.item?.imageUrl || '/placeholder-image.jpg'}
                          alt={item?.item?.name || 'Product'}
                          className="w-12 h-12 object-cover rounded-none border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-lato text-sm font-medium line-clamp-1">
                            {item?.item?.name || 'Unknown Product'}
                          </p>
                          <p className="font-lato text-xs text-gray-600">
                            Qty: {item?.quantity || 0}
                          </p>
                        </div>
                        <p className="font-lato text-sm font-medium">
                          {formatPrice(item?.subtotal || item?.price * item?.quantity || 0)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="font-lato text-sm text-gray-500">No items in order</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-gray-200 font-lato">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(safeOrderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{safeOrderSummary.shipping === 0 ? 'FREE' : formatPrice(safeOrderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(safeOrderSummary.tax)}</span>
                  </div>
                  {safeOrderSummary.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(safeOrderSummary.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(safeOrderSummary.total)}</span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="p-4 bg-blue-50 rounded-none border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle size={16} />
                  <span className="font-lato text-sm font-medium">Secure Checkout</span>
                </div>
                <p className="font-lato text-xs text-blue-600 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
