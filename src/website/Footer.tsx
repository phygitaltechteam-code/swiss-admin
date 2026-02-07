import React from 'react';
import {Facebook, Twitter, Instagram, Linkedin, Youtube} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-light border-gray-200 border-t pb-8 pt-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo & Info */}
          <div className="col-span-2 pr-8 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <div className="text-primary">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                  <path
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span className="text-lg font-bold text-black">Swissquote</span>
            </div>
            <p className="text-slate-body mb-6 text-sm leading-relaxed">
              Swissquote Bank Ltd is Switzerland &apos;s leading online bank. We
              provide online financial and trading services. We are regulated by
              FINMA and listed on the SIX Swiss Exchange.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="mb-4 font-bold text-black">Accounts</h4>
            <ul className="text-slate-body space-y-3 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Trading Account
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Forex Account
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Robo-Advisory
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Crypto-Assets
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-black">Support</h4>
            <ul className="text-slate-body space-y-3 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Fees & Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-black">Company</h4>
            <ul className="text-slate-body space-y-3 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Investor Relations
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Newsroom
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-gray-100 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-slate-body text-xs">
            © 2023 Swissquote Bank Ltd. All rights reserved.
          </p>
          <div className="text-slate-body flex gap-6 text-xs">
            <a href="#" className="transition-colors hover:text-black">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-black">
              Terms of Use
            </a>
            <a href="#" className="transition-colors hover:text-black">
              Cookie Preferences
            </a>
            <a href="#" className="transition-colors hover:text-black">
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
