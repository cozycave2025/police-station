"use client"

const AboutUsSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
        <h2   className="text-3xl md:text-4xl font-extrabold text-blue-600 
            drop-shadow-[0_0_10px_#3b82f6]">
            About Us
          </h2>

          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Learn more about OPROGEM's mission, legal framework, and partnerships in the fight against gender-based violence in Guinea.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Mission */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              OPROGEM is dedicated to protecting women, children, and morals in Guinea. With a “zero tolerance” approach, we ensure every case is treated with confidentiality and justice.
            </p>
          </div>

          {/* Legal Framework */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Legal Framework</h3>
            <p className="text-gray-700 leading-relaxed">
              Our system is based on Guinea’s Penal Code, Child Protection Code, and international laws criminalizing human trafficking and migrant smuggling.
            </p>
            <a href="#laws" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Read more about laws →
            </a>
          </div>

          {/* Partners */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Our Partners</h3>
            <p className="text-gray-700 leading-relaxed">
              Supported by partners such as IOM, United Nations, and Amnesty International, we work together to strengthen training, technical support, and GBV prevention in Guinea.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            📍 Prefectural offices available nationwide • ⏰ Office Hours: 8 AM – 6 PM • 📧 Contact us directly through the form
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutUsSection
