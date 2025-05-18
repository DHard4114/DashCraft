import ImageGallery from '../products/ImageGallery';
import BrandValueSlider from '../products/BrandValueSlider';
import ProductGrid from './ProductGrid';
import Advantages from './Advantages';
import Payment from './paymentMethod';

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-[#f4f4f4] text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 px-4 sm:py-20 sm:px-6 md:px-12 text-center bg-white shadow-sm">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-normal tracking-wide mb-4 leading-tight">
          Explore Unique DIY Creations
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-mono text-gray-600 max-w-xl mx-auto px-2">
          Handmade, heartfelt, and crafted with care — discover one-of-a-kind items perfect for your space.
        </p>
      </section>

      {/* Dynamic Brand Value Section with Sliders */}
      <section className="w-full flex flex-col md:flex-row min-h-[600px] md:min-h-screen">
        {/* Left Panel - Dynamic Image Gallery */}
        <div className="w-full md:w-1/2 h-[300px] md:h-auto">
          <ImageGallery />
        </div>

        {/* Right Panel - Brand Value Slider */}
        <div className="w-full md:w-1/2 h-[300px] md:h-auto">
          <BrandValueSlider />
        </div>
      </section>

      <div className="w-full h-2 bg-[#f1efdd]"></div>

      {/* Product Grid */}
      <section className="bg-[#fffef7] py-12 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="items-center flex flex-col bg-[#ffe7e7] p-8 sm:p-12 rounded-md">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-800 tracking-wide">
            Our DIY Collection
          </h2>
          <div className="w-12 h-px bg-gray-400 mx-auto mt-4"></div>
          <ProductGrid />
        </div>
      </section>

      <div className="w-full h-2 bg-[#e2e1e2]"></div>

      {/* Advantages Section */}
      <section className="flex flex-col md:flex-row w-full bg-[#f7fae8] justify-center items-center gap-6 p-6 md:p-12">
        <Advantages />
      </section>

      <div className="w-full h-2 bg-[#dbdbdb]"></div>

      {/* Payment Section */}
      <section className="w-full bg-[#fefff9] flex justify-center items-center  ">
        <Payment />
      </section>
    </div>
  );
};


export default Home;