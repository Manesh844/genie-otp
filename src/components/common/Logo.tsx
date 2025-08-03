
import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group" aria-label="GenieOTP Home">
      <Image 
        src="https://i.ibb.co/99jpyNM/logo.png" 
        alt="GenieOTP Logo" 
        width={36} 
        height={36} 
        className="group-hover:opacity-80 transition-opacity duration-300"
      />
      <span className="text-2xl font-bold font-headline text-primary group-hover:text-accent transition-colors duration-300">
        GenieOTP
      </span>
    </Link>
  );
}
