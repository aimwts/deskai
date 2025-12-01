import React from 'react';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/agent/mo',
      description: 'Perfect for small teams getting started with AI support.',
      features: ['Omnichannel Routing', 'Basic AI Responses', 'Email Support', 'Standard Analytics'],
      featured: false
    },
    {
      name: 'Pro',
      price: '$99',
      period: '/agent/mo',
      description: 'Advanced features for growing support operations.',
      features: ['Everything in Starter', 'Advanced Gemini Agents', 'Sentiment Analysis', 'CRM Integrations', '24/7 Phone Support'],
      featured: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Full-scale solution for global organizations.',
      features: ['Everything in Pro', 'Custom AI Model Fine-tuning', 'Dedicated Success Manager', 'SLA Guarantees', 'On-premise Deployment Options'],
      featured: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-950 relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your team size and AI needs. No hidden fees.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl p-8 border ${
                plan.featured 
                  ? 'bg-slate-900/50 border-indigo-500 shadow-xl shadow-indigo-500/10' 
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              } transition-all duration-300 hover:-translate-y-1`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 -mt-4 mr-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-500 ml-1">{plan.period}</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-300">
                    <Check className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a 
                href="#demo"
                className={`block w-full text-center py-3 rounded-xl font-bold transition-colors ${
                  plan.featured 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Start Trial'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;