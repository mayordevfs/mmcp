import { CreditCard, Smartphone, Shield, Globe } from 'lucide-react';

const KeyServicesSection = () => {
  const services = [
    {
      icon: CreditCard,
      title: "Digital Wallet",
      description: "Secure digital wallet supporting multiple currencies with instant conversion capabilities"
    },
    {
      icon: Smartphone,
      title: "Mobile Money Transfer",
      description: "Fast, low-cost money transfers optimized for mobile devices and emerging market needs"
    },
    {
      icon: Shield,
      title: "Compliance Solutions",
      description: "Full regulatory compliance with AML/KYC requirements across multiple jurisdictions"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Extensive partner network enabling seamless cross-border transactions worldwide"
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">
          Key Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <service.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyServicesSection;
