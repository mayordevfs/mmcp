const ProblemSolutionSection = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-600">The Problem</h2>
            <div className="space-y-4">
              {[
                "Limited access to stable currencies in emerging markets",
                "High fees and slow traditional money transfer systems",
                "Complex regulatory barriers for cross-border transactions",
                "Lack of financial infrastructure in underserved regions",
              ].map((problem, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-600">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Our Solution</h2>
            <div className="space-y-4">
              {[
                "Digital currency platform with instant access to stable currencies",
                "Low-cost, high-speed money transfer technology",
                "Compliance-first approach with regulatory partnerships",
                "Mobile-first design for widespread accessibility",
              ].map((solution, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-600">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
