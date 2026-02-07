import React from 'react';
import {ArrowRight, CheckCircle2, Globe} from 'lucide-react';
import {useNavigate} from '@tanstack/react-router';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-background-light relative overflow-hidden">
      {/* Abstract Background Shape */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-5">
        <svg
          className="h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            className="text-primary"
            d="M0 100 C 20 0 50 0 100 100 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex max-w-xl flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Swiss Made Banking
                </span>
              </div>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-black md:text-6xl">
                The Swiss Leader in{' '}
                <span className="text-primary">Online Banking</span>
              </h1>
              <p className="text-slate-body text-lg leading-relaxed">
                Access 3 million products across 60 global exchanges. Trade,
                invest, and bank with Swiss precision and security.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                className="hover:bg-primary-dark flex h-12 items-center gap-2 rounded-lg bg-primary px-8 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all"
                onClick={() => {
                  navigate({to: '/personalaccount'});
                }}
              >
                <span>Open an Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              {/* <button className="border-gray-200 hover:bg-gray-50 text-navy flex h-12 items-center gap-2 rounded-lg border bg-white px-8 text-base font-bold transition-colors">
                <span>Try Demo</span>
              </button> */}
            </div>

            <div className="text-slate-body flex items-center gap-6 pt-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Regulated by FINMA</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Listed on SIX Swiss Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image & Floating Card */}
          <div className="from-gray-100 border-gray-100 relative h-[400px] w-full overflow-hidden rounded-2xl border bg-gradient-to-br to-white shadow-2xl lg:h-[540px]">
            {/* Main Hero Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop')`,
              }}
            >
              <div className="from-background-light absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-90"></div>
            </div>

            {/* Floating Chart Card */}
            <div className="animate-fadeInUp absolute bottom-8 left-8 right-8 rounded-xl border border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-slate-body mb-1 text-sm">
                    Portfolio Growth
                  </p>
                  <p className="text-navy text-2xl font-bold">
                    +24.5%{' '}
                    <span className="text-sm font-normal text-green-500">
                      ↑ YTD
                    </span>
                  </p>
                </div>
                <div className="h-10 w-24">
                  <svg
                    className="h-full w-full fill-none stroke-primary stroke-[3px]"
                    viewBox="0 0 100 40"
                  >
                    <path d="M0 35 C 20 35, 30 10, 50 20 C 70 30, 80 5, 100 0"></path>
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-1 w-full rounded-full bg-primary"></div>
                <div className="h-1 w-full rounded-full bg-primary/40"></div>
                <div className="h-1 w-full rounded-full bg-primary/20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
