const FooterSection = () => {
  return (
    <footer className="py-16 px-6 bg-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">TransBridge</h2>
        <p className="text-xl text-white/90 mb-8">
          Democratizing global currency access for emerging markets
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-md font-medium transition-colors">
            Start Transfer
          </button>
          <button className="border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-md font-medium transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;