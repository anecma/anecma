import Image from 'next/image';
import { useEffect, useState } from 'react';

const Loading = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setFadeIn(true); 
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div
      className={`relative w-full h-screen bg-white ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
    >
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-pink-100 to-blue-100"></div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full flex justify-between px-8 max-w-screen-xl">
        <div className="flex space-x-6">
          <Image
            src="/images/Logo_Dikti.png"
            alt="Logo 1"
            width={48}
            height={48}
            quality={100}
            priority
          />
          <Image
            src="/images/Resmi_Logo_UMS.png"
            alt="Logo 2"
            width={48}
            height={48}
            quality={100}
            priority
          />
        </div>

        {/* Right Logos */}
        <div className="flex space-x-6">
          <Image
            src="/images/Logo_Kesmas.png"
            alt="Logo 3"
            width={128}
            height={48}
            quality={100}
            priority
          />
          <Image
            src="/images/logo-pti-compact.png"
            alt="Logo 4"
            width={48}
            height={48}
            quality={100}
            priority
          />
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <Image
          src="/images/Anecma_0b.png"
          alt="Main Logo"
          width={240}
          height={240}
          quality={100}
          priority
        />
      </div>
    </div>
  );
};

export default Loading;
