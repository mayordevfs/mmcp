const HeroSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-400">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-5xl font-bold mb-6">
          Democratizing Global Currency Access for Emerging Markets
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Bridging the gap between traditional finance and digital currencies through innovative technology solutions
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-blue-600 hover:bg-blue-100 px-8 py-3 rounded-md text-lg font-medium transition-colors">
            Get Started
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-md text-lg font-medium transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
