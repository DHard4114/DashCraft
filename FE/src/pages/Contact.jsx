import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Users, Award } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiry_type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Support' },
    { value: 'product', label: 'Product Question' },
    { value: 'wholesale', label: 'Wholesale Inquiry' },
    { value: 'collaboration', label: 'Collaboration' },
    { value: 'complaint', label: 'Complaint' }
  ];

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Phone',
      details: ['+62 21 1234 5678', '+62 812 3456 7890'],
      description: 'Mon-Fri 9AM-6PM, Sat 9AM-2PM'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      details: ['hello@dashcraft.id', 'support@dashcraft.id'],
      description: 'We respond within 24 hours'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Visit Our Studio',
      details: ['Jl. Kerajinan Artisan No. 123', 'Jakarta Selatan 12345'],
      description: 'Open daily 10AM-8PM'
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 9AM - 2PM'],
      description: 'Sunday: Closed'
    }
  ];

  const features = [
    {
      icon: <MessageSquare size={32} />,
      title: 'Live Chat Support',
      description: 'Get instant help from our customer service team'
    },
    {
      icon: <Users size={32} />,
      title: 'Expert Consultation',
      description: 'Schedule a call with our craft experts'
    },
    {
      icon: <Award size={32} />,
      title: 'After-Sales Service',
      description: 'Lifetime support for all our handcrafted products'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiry_type: 'general'
      });
    } catch (error) {
      setSubmitStatus(error.message || 'An error occurred while submitting your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-cookie text-7xl font-light text-white mb-6">
            Contact Us
          </h1>
          <p className="font-lato text-xl text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="font-cookie text-4xl font-light text-[#0a0205] mb-4">
                  Send us a Message
                </h2>
                <p className="font-lato text-gray-600">
                  Whether you have questions about our products, need support, or want to collaborate, 
                  we're here to help.
                </p>
              </div>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-none">
                  <p className="font-lato text-green-800">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-none">
                  <p className="font-lato text-red-800">
                    Something went wrong. Please try again or contact us directly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-lato"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-lato"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiry_type"
                    value={formData.inquiry_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-lato"
                  >
                    {inquiryTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-lato"
                    placeholder="What is this about?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block font-lato text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-lato resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 px-6 rounded-none hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-lato flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="mb-8">
                <h2 className="font-cookie text-4xl font-light text-[#0a0205] mb-4">
                  Get in Touch
                </h2>
                <p className="font-lato text-gray-600">
                  Reach out to us through any of these channels. We're always happy to help.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-6 mb-12">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-4 p-6 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-none flex items-center justify-center">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-lato font-medium text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="font-lato text-gray-700 mb-1">
                          {detail}
                        </p>
                      ))}
                      <p className="font-lato text-sm text-gray-500">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div>
                <h3 className="font-cookie text-3xl font-light text-[#0a0205] mb-6">
                  Why Choose DashCraft Support?
                </h3>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 text-gray-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-lato font-medium text-gray-900 mb-1">
                          {feature.title}
                        </h4>
                        <p className="font-lato text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-cookie text-5xl font-light text-[#0a0205] mb-6">
              Visit Our Studio
            </h2>
            <p className="font-lato text-gray-600 max-w-2xl mx-auto">
              Come see our artisans at work and explore our full collection in person. 
              We're located in the heart of Jakarta's creative district.
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-300 h-96 rounded-none flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin size={48} className="mx-auto mb-4" />
              <p className="font-lato text-lg font-medium mb-2">DashCraft Studio</p>
              <p className="font-lato">Jl. Kerajinan Artisan No. 123</p>
              <p className="font-lato">Jakarta Selatan 12345</p>
            </div>
          </div>

          {/* Studio Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-lato font-medium text-gray-900 mb-2">Studio Hours</h3>
              <p className="font-lato text-gray-600">Monday - Sunday</p>
              <p className="font-lato text-gray-600">10:00 AM - 8:00 PM</p>
            </div>
            <div className="text-center">
              <Phone className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-lato font-medium text-gray-900 mb-2">Call Ahead</h3>
              <p className="font-lato text-gray-600">+62 21 1234 5678</p>
              <p className="font-lato text-gray-600">Book a consultation</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-lato font-medium text-gray-900 mb-2">Meet the Team</h3>
              <p className="font-lato text-gray-600">Our artisans are happy</p>
              <p className="font-lato text-gray-600">to share their expertise</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-cookie text-4xl font-light text-[#0a0205] mb-6">
            Need Quick Answers?
          </h2>
          <p className="font-lato text-gray-600 mb-8 max-w-2xl mx-auto">
            Check out our frequently asked questions for instant answers to common inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/faqs'}
              className="px-8 py-3 bg-black text-white rounded-none hover:bg-gray-800 transition-colors font-lato"
            >
              View FAQs
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

export default Contact;
