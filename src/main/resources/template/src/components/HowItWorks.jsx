import React, { useState } from 'react';
import {
  Search,
  MapPin,
  CreditCard,
  LayoutGrid,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('driver');

  const steps = {
    driver: [
      {
        icon: <Search className="text-blue-600 w-7 h-7" />,
        title: 'Find a Spot',
        desc: 'Use the live map to discover available parking near your destination.',
      },
      {
        icon: <LayoutGrid className="text-blue-600 w-7 h-7" />,
        title: 'Select Slot',
        desc: 'Choose your preferred floor and specific slot (EV, Disabled, or Standard).',
      },
      {
        icon: <CreditCard className="text-blue-600 w-7 h-7" />,
        title: 'Pay & Park',
        desc: 'Confirm your time, pay securely, and follow the digital map.',
      },
    ],
    owner: [
      {
        icon: <MapPin className="text-blue-600 w-7 h-7" />,
        title: 'List Area',
        desc: 'Register your property and define your parking layout and floors.',
      },
      {
        icon: <ShieldCheck className="text-blue-600 w-7 h-7" />,
        title: 'Go Live',
        desc: 'Set your pricing rules and make your spots bookable online.',
      },
      {
        icon: <BarChart3 className="text-blue-600 w-7 h-7" />,
        title: 'Track Earnings',
        desc: 'Monitor live occupancy and revenue through your dashboard.',
      },
    ],
  };

  return (
    <section className="py-28 bg-white px-6 ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-black mb-6">
            How it <span className="text-blue-600">Works</span>
          </h2>
          <p className="text-gray-600 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            A smooth, guided experience built for drivers and landowners alike.
          </p>
        </div>

         <p className='text-white text-6xl' >,</p>

        {/* Tabs */}
        <div className="flex justify-center mb-15">
        <div className="flex gap-6">
        <button
           onClick={() => setActiveTab('driver')}
           className={` transition-all duration-300 border
            ${
             activeTab === 'driver'
               ? 'primary-btn'
               : 'secondary-btn'
            }`}
          >
            For Drivers
        </button>

        <button
             onClick={() => setActiveTab('owner')}
             className={` transition-all duration-300 border
            ${
              activeTab === 'owner'
                 ? 'primary-btn'
                 : 'secondary-btn'
            }`}
        >
            For Landowners
        </button>
         </div>
        </div>

        <p className='text-white' >,</p>
        {/* Steps */}
        <div className="grid gap-12 md:grid-cols-3">
          {steps[activeTab].map((step, index) => (
            <div
              key={index}
              className="why-us-card hover:border-blue-600
                         transition-all duration-300 group"
            >
              <div className="card-icon group-hover:shadow-md
                              transition-all duration-300">
                {step.icon}
              </div>
              
              <h3 className="text-2xl font-semibold text-black mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-lg">
                {step.desc}
              </p>

              {/* Arrow */}
              {index < 2 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                                text-gray-300 text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
        <p className='text-white text-6xl' >,</p>

      </div>
    </section>
  );
};

export default HowItWorks;
