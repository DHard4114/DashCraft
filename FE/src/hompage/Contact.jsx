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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        alert('File size exceeds 4MB. Please choose a smaller file.');
        e.target.value = null; // reset input
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form submitted:', formData);
    console.log('File:', file);

    setFormData({
      name: '',
      email: '',
      reason: '',
      material: '',
      message: ''
    });
    setFile(null);
    e.target.reset(); // Reset file input also
  };

  return (
    <div className="flex justify-center items-center py-7 bg-[#fff3f3] min-h-screen">
      <div className="w-full max-w-4xl flex flex-col justify-center items-center gap-8 p-4 font-mono text-black rounded-sm">

        {/* Contact Form */}
        <div className="w-full text-sm">
          <h2 className="text-xl font-bold border-b pb-1 mb-4 border-[#817a7a] text-center">By Email</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className="w-full border border-[#817a7a] p-1.5 rounded-sm text-sm"
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
                  className="w-full border border-[#817a7a] p-1.5 rounded-sm text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reason" className="block mb-1">
                  Reason for Email <span className="text-pink-500">*</span>
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full border border-[#817a7a] p-1.5 rounded-sm bg-white text-sm"
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
                  className="w-full border border-[#817a7a] p-1.5 rounded-sm bg-white text-sm"
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
                className="w-full border border-[#817a7a] p-1.5 rounded-sm text-sm"
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
                className="w-full border border-[#817a7a] p-2 rounded-sm h-24 text-sm"
                required
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="text-black hover:bg-[#CD83B2] px-5 py-1.5 border border-[#817a7a] rounded-sm bg-[#ffffff] transition-colors text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Customer Service Info */}
        <div className="w-full text-center space-y-6 text-sm">
          <h2 className="text-xl font-bold border-b pb-1 mb-3 border-[#817a7a]">Customer Service</h2>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-black" />
              <a href="mailto:dashcraft@gmail.com" className="hover:underline truncate">dashcraft@gmail.com</a>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-black" />
              <span>+62-811-1704-2207</span>
            </div>

            <div className="flex items-start gap-2">
              <Clock size={16} className="text-black mt-0.5" />
              <div>
                <p>Monday - Friday</p>
                <p>8:00am - 4:00pm EST</p>
              </div>
            </div>
          </div>

          <div className=''>
            <h3 className="text-base font-semibold border-b pb-1 mb-3 border-[#817a7a]">SOCIAL</h3>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <Twitter size={16} className="text-black" />
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Twitter</a>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Instagram size={16} className="text-black" />
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Instagram</a>
              </div>

              <div className="flex items-center justify-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-black"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5 8C11 6.5 8.5 7 7.5 8.5C6.5 10 7 12 8.5 13L12 16.5L15.5 13C17 12 17.5 10 16.5 8.5C15.5 7 13 6.5 11.5 8L12 8.5L12.5 8Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Pinterest</a>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Facebook size={16} className="text-black" />
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Facebook</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
