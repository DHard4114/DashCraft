import { useState } from 'react';
import { Mail, Phone, Clock, Twitter, Instagram, Facebook } from 'lucide-react';
import {FaPinterest} from 'react-icons/fa';

function Contact() {
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
        <div className="flex justify-center items-center pt-12">
            <div className="flex bg-[#fff3f3] flex-row lg:flex-row justify-center items-center gap-12 max-w-6xl mx-auto p-6 font-mono text-black">
            {/* Customer Service Info */}
            <div className="w-full lg:w-1/3 space-y-8 text-center">
                <h2 className="text-2xl font-bold border-b pb-2 border-black">Customer Service</h2>

                <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <Mail size={18} className="text-black" />
                    <a href="mailto:info@ritdye.com" className=" hover:underline">dashcraft@gmail.com</a>
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
                    <a href="#" className="hover:underline ">Twitter</a>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                    <Instagram size={18} className="text-black" />
                    <a href="#" className="hover:underline ">Instagram</a>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                    <FaPinterest size={18} className="text-black" />
                    <a href="#" className="hover:underline ">Pinterest</a>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                    <Facebook size={18} className="text-black" />
                    <a href="#" className="hover:underline ">Facebook</a>
                    </div>
                </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
                <h2 className="text-2xl font-bold border-b pb-2 mb-6 border-black text-center">By Email</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                    required
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
                    required
                    />
                </div>

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
                    required
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
                    required
                    ></textarea>
                </div>

                <div className="flex justify-center">
                    <button
                    type="submit"
                    className=" text-black hover:bg-[#CD83B2] px-6 py-2 border border-black rounded-sm bg-[#ffffff] transition-colors"
                    >
                    Submit
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
    );
}

export default Contact;
