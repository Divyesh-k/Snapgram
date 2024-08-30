/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";

// @ts-ignore
const Uiloder = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 2000); // 3 seconds for the full animation

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-dark-1">
      <div className="flex flex-col items-center">
        <div className="animate-[spin_0.5s_ease-in-out] w-32 h-32">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27.8333 15C27.8333 22.0877 22.0877 27.8333 15 27.8333C7.91234 27.8333 2.16666 22.0877 2.16666 15C2.16666 7.91234 7.91234 2.16666 15 2.16666C22.0877 2.16666 27.8333 7.91234 27.8333 15ZM30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15ZM23.2759 8.27586C23.2759 9.13288 22.5812 9.82759 21.7242 9.82759C20.8672 9.82759 20.1725 9.13288 20.1725 8.27586C20.1725 7.41884 20.8672 6.72414 21.7242 6.72414C22.5812 6.72414 23.2759 7.41884 23.2759 8.27586ZM10.4879 16.209C11.1556 18.7009 13.717 20.1797 16.2089 19.512C18.7008 18.8443 20.1796 16.2829 19.5119 13.791C18.8442 11.2991 16.2828 9.82031 13.7909 10.488C11.299 11.1557 9.82015 13.7171 10.4879 16.209ZM8.39503 16.7698C9.37244 20.4175 13.1219 22.5823 16.7696 21.6049C20.4174 20.6274 22.5821 16.878 21.6047 13.2302C20.6273 9.58252 16.8779 7.41773 13.2301 8.39515C9.58236 9.37256 7.41762 13.122 8.39503 16.7698Z"
              fill="url(#paint0_linear_120_1360)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_120_1360"
                x1="15"
                y1="0"
                x2="15"
                y2="30"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#877EFF" />
                <stop offset="0.461458" stopColor="#685DFF" />
                <stop offset="1" stopColor="#3121FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="mt-4 text-4xl text-container logo-text">
          <span>Snapgram</span>
        </div>
      </div>
    </div>
  );
};

export default Uiloder;