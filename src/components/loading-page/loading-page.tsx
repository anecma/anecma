import Image from 'next/image';
import { useEffect, useState } from 'react';

const Loading = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
    className={`relative w-screen h-screen bg-white ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 overflow-hidden`}
  >
  
      {/* Background 1 */}
      <div
        className="absolute"
        style={{
          width: '950px',
          height: '950px',
          top: '253px',
          left: '-397px',
          opacity: '0.05',
        }}
      >
        <Image
          src="/images/Anecma_0B.png"
          alt="Background 1"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Background 2 */}
      <div
        className="absolute"
        style={{
          width: '950px',
          height: '950px',
          top: '-487px',
          left: '-91px',
          opacity: '0.05',
        }}
      >
        <Image
          src="/images/Anecma_0B.png"
          alt="Background 2"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Ikon utama (Anecma) di tengah layar */}
      <div
        className="absolute"
        style={{
          width: '220px',
          height: '220px',
          top: '316px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: fadeIn ? '1' : '0',
        }}
      >
        <Image
          src="/images/Anecma_0B.png"
          alt="Main Logo"
          width={220}
          height={220}
          quality={100}
          priority
        />
      </div>

      {/* Ikon di bawah */}
      <div
        className="absolute"
        style={{
          width: '290px',
          height: '40px',
          top: '674px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
          opacity: fadeIn ? '1' : '0',
        }}
      >
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
  );
};

export default Loading;
