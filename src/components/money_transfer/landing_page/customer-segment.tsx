import { Users, Building, Smartphone } from 'lucide-react';

const CustomerSegmentsSection = () => {
  const segments = [
    {
      icon: Users,
      title: "Individual Consumers",
      description: "People seeking affordable remittance and currency exchange services",
      features: ["Low-cost transfers", "Mobile accessibility", "Multi-currency support"]
    },
    {
      icon: Building,
      title: "Small Businesses",
      description: "SMEs needing efficient cross-border payment solutions",
      features: ["Business accounts", "Bulk transfers", "Payment APIs"]
    },
    {
      icon: Smartphone,
      title: "Mobile Money Operators",
      description: "Partners expanding their service offerings with digital currencies",
      features: ["White-label solutions", "Integration support", "Compliance assistance"]
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">
          Customer Segments
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <segment.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">
                {segment.title}
              </h3>
              <p className="text-gray-600 mb-6">{segment.description}</p>
              <ul className="space-y-2">
                {segment.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerSegmentsSection;
