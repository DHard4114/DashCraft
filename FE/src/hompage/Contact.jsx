import { useState } from 'react';
import { Mail, Phone, Clock, Twitter, Instagram, Facebook } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        reason: '',
        material: '',
        message: ''
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
        setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        console.log('File:', file);
    };

    return (
        <div className="flex justify-center items-center">
        <div className="w-full max-w-full px-12 md:mx-12 lg:mx-auto">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-12 bg-[#fff3f3] p-6 font-mono text-black">
            {/* Customer Service Info */}
            <div className="w-full lg:w-1/3 space-y-8 text-center">
                <h2 className="text-2xl font-bold border-b pb-2 border-black">Customer Service</h2>

                <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <Mail size={18} className="text-black" />
                    <a href="#" className="hover:underline">dashcraft@gmail.com</a>
                </div>

                <div className="flex items-center justify-center gap-3">
                    <Phone size={18} className="text-black" />
                    <span>+62-811-1704-2207</span>
                </div>

                <div className="flex items-start justify-center gap-3">
                    <Clock size={18} className="text-black mt-1" />
                    <div>
                    <p>Monday - Friday</p>
                    <p>8:00am - 4:00pm EST</p>
                    </div>
                </div>
                </div>

                <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4 border-black flex items-center justify-center gap-2">
                    SOCIAL
                </h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                    <Twitter size={18} className="text-black" />
                    <a href="#" className="hover:underline">Twitter</a>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                    <Instagram size={18} className="text-black" />
                    <a href="#" className="hover:underline">Instagram</a>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="text-black">
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.5 8C11 6.5 8.5 7 7.5 8.5C6.5 10 7 12 8.5 13L12 16.5L15.5 13C17 12 17.5 10 16.5 8.5C15.5 7 13 6.5 11.5 8L12 8.5L12.5 8Z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <a href="#" className="hover:underline">Pinterest</a>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                    <Facebook size={18} className="text-black" />
                    <a href="#" className="hover:underline">Facebook</a>
                    </div>
                </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
                <h2 className="text-2xl font-bold border-b pb-2 mb-6 border-black text-center">
                By Email
                </h2>

                <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="name" className="block mb-1">
                        Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-black p-2 rounded-sm"
                    />
                    </div>

                    <div>
                    <label htmlFor="email" className="block mb-1">
                        Email <span className="text-pink-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-black p-2 rounded-sm"
                    />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="reason" className="block mb-1">
                        Reason for Email <span className="text-pink-500">*</span>
                    </label>
                    <select
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full border border-black p-2 rounded-sm bg-white"
                    >
                        <option value="">Please select one.</option>
                        <option value="general">General Inquiry</option>
                        <option value="product">Product Question</option>
                        <option value="support">Customer Support</option>
                        <option value="feedback">Feedback</option>
                    </select>
                    </div>

                    <div>
                    <label htmlFor="material" className="block mb-1">
                        Fabric/Material (If Applicable)
                    </label>
                    <select
                        id="material"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="w-full border border-black p-2 rounded-sm bg-white"
                    >
                        <option value="">Please select one.</option>
                        <option value="cotton">Cotton</option>
                        <option value="wool">Wool</option>
                        <option value="silk">Silk</option>
                        <option value="synthetic">Synthetic</option>
                        <option value="other">Other</option>
                    </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="photo" className="block mb-1">
                    Send Us a Photo (Optional)
                    </label>
                    <input
                    type="file"
                    id="photo"
                    onChange={handleFileChange}
                    className="w-full border border-black p-2 rounded-sm"
                    accept=".jpg,.gif,.png,.bmp"
                    />
                    <p className="text-xs text-gray-600 mt-1">Accepted: jpg, gif, png, bmp. Max 4MB.</p>
                </div>

                <div>
                    <label htmlFor="message" className="block mb-1">
                    Message <span className="text-pink-500">*</span>
                    </label>
                    <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border border-black p-2 rounded-sm h-32"
                    ></textarea>
                </div>

                <div className="flex justify-center">
                    <button
                    onClick={handleSubmit}
                    className="text-black hover:bg-[#CD83B2] px-6 py-2 border border-black rounded-sm bg-[#ffffff] transition-colors"
                    >
                    Submit
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}