import React from 'react';
import { Award, Users, Clock, Heart, Star, Scissors, Palette, Hammer } from 'lucide-react';

const OurCraftsmanship = () => {
  const craftingSteps = [
    {
      step: '01',
      title: 'Design & Concept',
      description: 'Every piece begins with a carefully crafted design that balances aesthetics with functionality.',
      icon: <Palette size={40} />
    },
    {
      step: '02',
      title: 'Material Selection',
      description: 'We source only the finest materials, ensuring each component meets our exacting standards.',
      icon: <Star size={40} />
    },
    {
      step: '03',
      title: 'Precision Crafting',
      description: 'Our skilled artisans bring decades of experience to every cut, fold, and stitch.',
      icon: <Scissors size={40} />
    },
    {
      step: '04',
      title: 'Quality Assurance',
      description: 'Each piece undergoes rigorous quality checks before earning the DashCraft seal of excellence.',
      icon: <Award size={40} />
    }
  ];

  const artisans = [
    {
      name: 'Master Chen',
      specialty: 'Leather Crafting',
      experience: '25+ years',
      image: '/artisan-1.jpg'
    },
    {
      name: 'Sarah Williams',
      specialty: 'Textile Design',
      experience: '18+ years', 
      image: '/artisan-2.jpg'
    },
    {
      name: 'Antonio Rodriguez',
      specialty: 'Metal Working',
      experience: '30+ years',
      image: '/artisan-3.jpg'
    }
  ];

  const stats = [
    { number: '50+', label: 'Master Artisans', icon: <Users size={24} /> },
    { number: '15', label: 'Years of Excellence', icon: <Clock size={24} /> },
    { number: '10k+', label: 'Happy Customers', icon: <Heart size={24} /> },
    { number: '100%', label: 'Handcrafted', icon: <Hammer size={24} /> }
  ];

  return (
    <div className="min-h-screen bg-[#ffffff]">
      
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-cookie text-7xl font-light mb-6">
            Our Craftsmanship
          </h1>
          <p className="font-lato text-xl max-w-2xl mx-auto leading-relaxed">
            Where tradition meets innovation. Every piece tells a story of 
            dedication, skill, and unwavering commitment to excellence.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-gray-800">
                  {stat.icon}
                </div>
                <div className="font-cookie text-4xl font-light text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="font-lato text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crafting Process */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-cookie text-5xl font-light text-[#0a0205] mb-6">
              The Art of Creation
            </h2>
            <p className="font-lato text-gray-600 max-w-2xl mx-auto">
              Each DashCraft piece follows a meticulous process that has been 
              refined over generations, ensuring every detail meets our exacting standards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {craftingSteps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-black text-white rounded-none flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <div className="font-cookie text-2xl font-light text-gray-400">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="font-lato text-xl font-medium text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="font-lato text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Master Artisans */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-cookie text-5xl font-light text-[#0a0205] mb-6">
              Master Artisans
            </h2>
            <p className="font-lato text-gray-600 max-w-2xl mx-auto">
              Meet the skilled craftspeople who bring each piece to life with 
              their expertise, passion, and unwavering attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artisans.map((artisan, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 bg-gray-300 rounded-none mx-auto mb-6 flex items-center justify-center">
                  <Users size={48} className="text-gray-500" />
                </div>
                <h3 className="font-lato text-xl font-medium text-gray-900 mb-2">
                  {artisan.name}
                </h3>
                <p className="font-lato text-gray-600 mb-1">
                  {artisan.specialty}
                </p>
                <p className="font-lato text-sm text-gray-500">
                  {artisan.experience}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-cookie text-5xl font-light text-[#0a0205] mb-8">
              Our Philosophy
            </h2>
            <div className="font-lato text-lg text-gray-700 leading-relaxed space-y-6">
              <p>
                At DashCraft, we believe that true craftsmanship is more than just 
                technique—it's a philosophy that honors tradition while embracing innovation. 
                Each piece we create is a testament to the marriage of time-honored methods 
                and contemporary design sensibilities.
              </p>
              <p>
                We don't just make products; we create heirlooms. Every stitch, every cut, 
                every finish is executed with the understanding that what we create today 
                will be cherished for generations to come.
              </p>
              <div className="pt-8">
                <blockquote className="font-cookie text-3xl font-light text-gray-800 italic">
                  "Excellence is never an accident. It is always the result of high intention, 
                  sincere effort, and intelligent execution."
                </blockquote>
                <p className="font-lato text-gray-600 mt-4">— DashCraft Founding Principle</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-cookie text-4xl font-light mb-6">
            Experience the Difference
          </h2>
          <p className="font-lato text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the artistry and passion that goes into every DashCraft piece. 
            Join thousands who have made quality their choice.
          </p>
          <button className="border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors font-lato rounded-none">
            Explore Our Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default OurCraftsmanship;