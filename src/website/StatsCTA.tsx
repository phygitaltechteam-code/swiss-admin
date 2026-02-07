// import React from 'react';

// const StatsCTA: React.FC = () => {
//   return (
//     <section className="bg-navy relative overflow-hidden py-20 text-white">
//       {/* Background Image Overlay */}
//       <div
//         className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
//         style={{
//           backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop')`,
//         }}
//       ></div>
//       {/* Gradient Overlay */}
//       <div className="from-navy via-navy/90 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent"></div>

//       <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
//           {/* CTA Text */}
//           <div className="flex-1">
//             <h2 className="mb-4 text-3xl font-bold">
//               Ready to start your journey?
//             </h2>
//             <p className="text-gray-300 mb-8 max-w-xl text-lg">
//               Join over 500,000 clients who trust Swissquote for their financial
//               success. Open your account digitally in minutes.
//             </p>
//             <div className="flex flex-col gap-4 sm:flex-row">
//               <button className="hover:bg-primary-dark rounded-lg bg-primary px-8 py-3 text-center font-bold text-white shadow-lg shadow-primary/20 transition-colors">
//                 Open an Account
//               </button>
//               <button className="rounded-lg border border-white/30 bg-transparent px-8 py-3 text-center font-bold text-white transition-colors hover:bg-white/10">
//                 Compare Accounts
//               </button>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid w-full grid-cols-2 gap-8 md:w-auto md:gap-12">
//             <div>
//               <p className="mb-1 text-4xl font-black text-primary">20+</p>
//               <p className="text-gray-400 text-sm">Years of Experience</p>
//             </div>
//             <div>
//               <p className="mb-1 text-4xl font-black text-primary">3M+</p>
//               <p className="text-gray-400 text-sm">Financial Products</p>
//             </div>
//             <div>
//               <p className="mb-1 text-4xl font-black text-primary">500k</p>
//               <p className="text-gray-400 text-sm">Happy Clients</p>
//             </div>
//             <div>
//               <p className="mb-1 text-4xl font-black text-primary">Tier 1</p>
//               <p className="text-gray-400 text-sm">Capital Ratio</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

import React from 'react';
import {useNavigate} from '@tanstack/react-router';
const stats = [
  {value: '20+', label: 'Years of Experience'},
  {value: '3M+', label: 'Financial Products'},
  {value: '500k', label: 'Happy Clients'},
  {value: 'Tier 1', label: 'Capital Ratio'},
];
const StatsCTA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-navy relative overflow-hidden py-20 text-white transition-colors duration-300 dark:bg-black">
      {/* Background Image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop')`,
        }}
      ></div>
      {/* Gradient Overlay */}
      {/* <div className="from-navy via-navy/90 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent dark:from-black dark:to-black/80"></div> */}

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="flex-1">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to start your journey?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl text-lg">
              Join over 500,000 clients who trust Swissquote for their financial
              success. Open your account digitally in minutes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate({to: '/'})}
                className="hover:bg-primary-dark rounded-lg bg-primary px-8 py-3 text-center font-bold text-white shadow-lg shadow-primary/20 transition-colors"
              >
                Open an Account
              </button>
              <button className="rounded-lg border border-white/30 bg-transparent px-8 py-3 text-center font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                Compare Accounts
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="mb-1 text-4xl font-black text-primary">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default StatsCTA;
