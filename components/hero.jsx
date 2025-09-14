"use client"

export default function HeroSection() {
  return (
    <section
      className="relative h-[100vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero-justice-background.jpg')",
      }}
    >
      {/* Full black shadow */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Bottom blue gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 
  [text-shadow:0_0_5px_#3b82f6,0_0_20px_#3b82f6,0_0_10px_#2563eb]">
  E-OPROGEM
</h1>

        <h2 className="text-2xl md:text-3xl font-bold text-blue-500 mt-2">
          Managing Gender-Based Violence in Guinea
        </h2>

        <p className="mt-6 text-lg md:text-xl text-gray-200 drop-shadow-[0_0_10px_blue-500]">
          A powerful digital tool by the Office for the Protection of Gender, Children, and Morals (OPROGEM) to centralize GBV case management, improve transparency, and strengthen public trust in Guinea.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold shadow-[0_0_15px_blue-500] hover:bg-blue-600 hover:scale-105 transition">
            Report GBV Case
          </button>

          <button className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-lg text-lg font-semibold shadow-[0_0_12px_blue-500] hover:bg-blue-500 hover:text-white transition">
            Login
          </button>
        </div>
      </div>
    </section>
  )
}
