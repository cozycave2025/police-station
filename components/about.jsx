"use client"

const AboutUsSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2   className="text-3xl md:text-4xl font-extrabold text-blue-600 
            drop-shadow-[0_0_10px_#3b82f6]">
            À propos de nous
          </h2>

          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez la mission, le cadre juridique et les partenariats de l’OPROGEM dans la lutte contre les violences basées sur le genre en Guinée.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Mission */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Notre mission</h3>
            <p className="text-gray-700 leading-relaxed">
              L’OPROGEM s’engage à protéger les femmes, les enfants et les mœurs en Guinée. Avec une approche de « tolérance zéro », nous garantissons que chaque cas est traité avec confidentialité et justice.
            </p>
          </div>

          {/* Legal Framework */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Cadre juridique</h3>
            <p className="text-gray-700 leading-relaxed">
              Notre système s’appuie sur le Code pénal guinéen, le Code de protection de l’enfance et les lois internationales incriminant la traite des personnes et le trafic de migrants.
            </p>
            <a href="#laws" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              En savoir plus sur les lois →
            </a>
          </div>

          {/* Partners */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Nos partenaires</h3>
            <p className="text-gray-700 leading-relaxed">
              Avec l’appui de partenaires tels que l’OIM, les Nations Unies et Amnesty International, nous renforçons la formation, l’appui technique et la prévention des VBG en Guinée.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            📍 Bureaux préfectoraux disponibles dans tout le pays • ⏰ Heures d’ouverture : 8h – 18h • 📧 Contactez-nous directement via le formulaire
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutUsSection
