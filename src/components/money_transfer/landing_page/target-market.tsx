const TargetMarketsSection = () => {
  const markets = [
    "Sub-Saharan Africa",
    "Southeast Asia",
    "Latin America",
    "Eastern Europe",
    "Middle East & North Africa"
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">Target Markets</h2>
        <p className="text-xl text-gray-600 mb-12">
          Focusing on emerging markets with high demand for financial inclusion
        </p>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {markets.map((market, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800">{market}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetMarketsSection;
