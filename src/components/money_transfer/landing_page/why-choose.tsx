import { Zap, DollarSign, Shield, Clock } from 'lucide-react';

const WhyChooseSection = () => {
  const reasons = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant transactions powered by cutting-edge blockchain technology"
    },
    {
      icon: DollarSign,
      title: "Low Fees",
      description: "Transparent pricing with fees up to 90% lower than traditional banks"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Military-grade encryption and compliance with international standards"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock service with no downtime or banking hours restrictions"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">
          Why Choose TransBridge?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <reason.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                {reason.title}
              </h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
