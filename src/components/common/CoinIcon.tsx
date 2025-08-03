
import Image from 'next/image';
import type { SVGProps } from 'react';

// Keeping SVGProps for compatibility if we ever switch back or for general icon typing elsewhere
interface CoinIconProps extends Omit<SVGProps<SVGSVGElement>, 'src'> {
  // We can add specific props for the image if needed, e.g., size
  size?: number;
}

export default function CoinIcon({ className, size = 20, ...props }: CoinIconProps) {
  return (
    <div style={{ width: size, height: size }} className={className}>
      <Image
        src="https://i.ibb.co/gLVvdmd/coin-sysmbol.png"
        alt="Coin"
        width={size}
        height={size}
        className="object-contain inline-block" // Ensures the image scales nicely within the div
        {...props} // Spread remaining props, though Image has its own specific ones
      />
    </div>
  );
}
