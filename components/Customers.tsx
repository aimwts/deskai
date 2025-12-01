import React from 'react';

const Customers: React.FC = () => {
  const logos = [
    { name: 'Acme Corp', color: 'bg-blue-500' },
    { name: 'Global Tech', color: 'bg-green-500' },
    { name: 'Nebula Inc', color: 'bg-purple-500' },
    { name: 'Cloud Systems', color: 'bg-indigo-500' },
    { name: 'Future AI', color: 'bg-pink-500' },
  ];

  return (
    <section id="customers" className="py-20 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-slate-400 font-medium mb-8 uppercase tracking-widest text-sm">Trusted by innovative teams worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500">
             {logos.map((logo, idx) => (
               <div key={idx} className="flex items-center gap-2 font-bold text-xl text-white group cursor-default">
                 <div className={`w-8 h-8 rounded-full ${logo.color} opacity-80 group-hover:scale-110 transition-transform`}></div>
                 <span className="group-hover:text-indigo-200 transition-colors">{logo.name}</span>
               </div>
             ))}
        </div>
      </div>
    </section>
  );
};

export default Customers;