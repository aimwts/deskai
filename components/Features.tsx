import React from 'react';
import { Network, Globe, Lock, BarChart3, Users, Cpu } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: 'Omnichannel Routing',
    description: 'Seamlessly route voice, email, chat, and social queries to the right agent or AI bot instantly.',
    icon: Network,
  },
  {
    title: 'Global Voice Quality',
    description: 'Crystal clear HD audio with 60+ global points of presence ensuring low latency everywhere.',
    icon: Globe,
  },
  {
    title: 'Enterprise Security',
    description: 'SOC2 Type II compliant, HIPAA ready, and end-to-end encryption for all sensitive customer data.',
    icon: Lock,
  },
  {
    title: 'Real-time Analytics',
    description: 'Visualize customer journey friction points and agent performance with live dashboards.',
    icon: BarChart3,
  },
  {
    title: 'Workforce Engagement',
    description: 'AI-driven forecasting and scheduling to keep your team happy and service levels high.',
    icon: Users,
  },
  {
    title: 'Self-Service Automation',
    description: 'Deflect tier-1 tickets with Gemini-powered chatbots that feel naturally human.',
    icon: Cpu,
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">delight your customers</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A complete cloud contact center platform built for the AI era. Scalable, secure, and smart.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
