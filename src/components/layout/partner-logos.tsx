import Image from 'next/image';

const logos = [
  { src: '/logos/cdc.png', alt: 'CDC Logo' },
  { src: '/logos/mis.png', alt: 'MIS Logo' },
  { src: '/logos/iedcr.png', alt: 'IEDCR Logo' },
  { src: '/logos/unops.png', alt: 'UNOPS Logo' },
  { src: '/logos/brac.png', alt: 'BRAC Logo' },
  { src: '/logos/moru.png', alt: 'MORU Logo' },
  { src: '/logos/gm.png', alt: 'GM Logo' },
  { src: '/logos/imacs.png', alt: 'IMACS Logo' },
];

export default function PartnerLogos() {
  return (
    <div className="flex items-center gap-4">
      {logos.map((logo, index) => (
        <div key={index} className="relative h-8 w-16">
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}
