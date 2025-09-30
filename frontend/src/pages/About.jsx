import React from 'react';

const About = () => {

  const features = [
    {
      title: 'Quality Assurance',
      description: 'We meticulously select and vet each product to ensure it meets our stringent quality standards.',
    },
    {
      title: 'Convenience',
      description: 'With our user-friendly interface and hassle-free ordering process, shopping has never been easier.',
    },
    {
      title: 'Exceptional Customer Service',
      description: 'Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.',
    },
  ];

  return (
    <>
      <section className="py-16 md:py-24 bg-white text-gray-800">
        <div className="container mx-auto mt-6 px-6 lg:px-8">
          
          {/* --- Main Title --- */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                ABOUT US
              </h2>
              <span className="hidden sm:block w-16 h-0.5 bg-gray-700 ml-4"></span>
            </div>
          </div>

          {/* --- Content Grid: Image and Text --- */}
          {/* Flex container: stacks vertically on mobile, horizontally on medium screens and up */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            
            {/* Image Container */}
            <div className="md:w-1/2">
            
              <img 
                src={"https://media.istockphoto.com/id/1325449614/photo/row-of-colorful-apparel-on-shoulders-hangers-of-t-shirts-of-retail-shop-with-other-items-on.jpg?s=612x612&w=0&k=20&c=8fz76sSj8LJflIsYjd6Eoqi3Xo5er4nfvBiA5kjXfQI="} 
                alt="Cozy fashion items laid out on a white surface" 
                className="w-full h-auto rounded-lg shadow-xl" 
              />
            </div>

            {/* Text Container */}
            <div className="md:w-1/2">
              <p className="text-gray-600 text-base md:text-[16px] leading-relaxed mb-6">
                <strong className="font-semibold text-gray-900">Flaire</strong> was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
              </p>
              <p className="text-gray-600 text-base md:text-[16px] leading-relaxed mb-8">
                Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 text-base md:text-[16px] leading-relaxed">
                Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">

          {/* --- Main Title --- */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 uppercase">
                Why Choose Us
              </h2>
              {/* Decorative line, hidden on small screens */}
              <span className="hidden sm:block w-16 h-0.5 bg-gray-700 ml-4"></span>
            </div>
          </div>

          {/* --- Features Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-gray-200 text-center">
            {features.map((feature, index) => (
              <div key={index} className="px-8 py-6 md:py-0">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}:
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
        </div>
      </section>
    </>

  );
};

export default About;