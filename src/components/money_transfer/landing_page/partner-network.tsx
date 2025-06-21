const PartnerNetworkSection = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-400">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Global Partner Network</h2>
        <p className="text-xl text-white/90 mb-8">
          Over 50 partners including BDCs, PSPs, and remittance firms
        </p>
        <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-md font-medium transition-colors">
          Become a Partner
        </button>
      </div>
    </section>
  );
};

export default PartnerNetworkSection;