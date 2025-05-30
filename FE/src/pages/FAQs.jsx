import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Package, CreditCard, Truck, RefreshCw, Heart, Shield } from 'lucide-react';

const FAQs = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: <Search size={20} /> },
    { id: 'orders', label: 'Orders & Shipping', icon: <Package size={20} /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={20} /> },
    { id: 'products', label: 'Products', icon: <Heart size={20} /> },
    { id: 'returns', label: 'Returns & Exchanges', icon: <RefreshCw size={20} /> },
    { id: 'account', label: 'Account', icon: <Shield size={20} /> }
  ];

  const faqs = [
    {
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-7 business days within Indonesia. Express shipping is available for 1-2 business days. International shipping varies by destination, usually 7-14 business days.'
    },
    {
      category: 'orders',
      question: 'Can I track my order?',
      answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track your order status in your account under "My Orders" section.'
    },
    {
      category: 'orders',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. International orders may be subject to customs duties and taxes.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard), bank transfers, e-wallets (GoPay, OVO, Dana), and cash on delivery (COD) for select areas.'
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your credit card details on our servers.'
    },
    {
      category: 'payment',
      question: 'Can I pay in installments?',
      answer: 'Yes, we offer installment options through select credit cards and payment partners. Check available options during checkout.'
    },
    {
      category: 'products',
      question: 'Are your products handmade?',
      answer: 'Yes, all DashCraft products are meticulously handcrafted by our skilled artisans using traditional techniques combined with modern design principles.'
    },
    {
      category: 'products',
      question: 'What materials do you use?',
      answer: 'We use only premium, sustainably-sourced materials including genuine leather, organic cotton, recycled metals, and responsibly-harvested wood.'
    },
    {
      category: 'products',
      question: 'How do I care for my DashCraft items?',
      answer: 'Each product comes with specific care instructions. Generally, we recommend storing leather items in dust bags, avoiding direct sunlight, and using appropriate cleaning products for each material.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original condition. Custom or personalized items cannot be returned unless defective.'
    },
    {
      category: 'returns',
      question: 'How do I return an item?',
      answer: 'Go to "My Orders" in your account, select the item you want to return, and follow the return instructions. We\'ll provide a prepaid return label for eligible returns.'
    },
    {
      category: 'returns',
      question: 'When will I receive my refund?',
      answer: 'Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method.'
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Login" in the top navigation, then select "Create Account". You\'ll need to provide your email, create a password, and verify your email address.'
    },
    {
      category: 'account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'On the login page, click "Forgot Password" and enter your email address. We\'ll send you a reset link to create a new password.'
    },
    {
      category: 'account',
      question: 'How do I update my account information?',
      answer: 'Log into your account and go to "Profile Settings" where you can update your personal information, shipping addresses, and preferences.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-cookie text-6xl font-light text-[#0a0205] mb-6">
              Frequently Asked Questions
            </h1>
            <p className="font-lato text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, 
              returns, and more. Can't find what you're looking for? Contact us!
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-lato"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-none transition-colors font-lato text-sm ${
                  selectedCategory === category.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-lato text-xl font-medium text-gray-900 mb-2">
                  No questions found
                </h3>
                <p className="font-lato text-gray-600">
                  Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-none">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-lato font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      {openFAQ === index ? (
                        <ChevronUp className="text-gray-500 flex-shrink-0" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                      )}
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-4">
                        <p className="font-lato text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-cookie text-4xl font-light text-[#0a0205] mb-6">
            Still have questions?
          </h2>
          <p className="font-lato text-gray-600 mb-8 max-w-2xl mx-auto">
            Our customer support team is here to help. Reach out to us and 
            we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato">
              Contact Support
            </button>
            <button className="px-8 py-3 border border-black text-black rounded-none hover:bg-black hover:text-white transition-colors font-lato">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;