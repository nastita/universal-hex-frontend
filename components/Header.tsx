import Link from 'next/link';
import { WandSparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className='bg-purple-900 p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link
          href='/'
          className='text-2xl font-bold text-white flex items-center'
        >
          <WandSparkles className='w-8 h-8 mr-2' />
          Universal HEX
        </Link>
        <nav>
          <ul className='flex space-x-4'>
            <li>
              <Link href='/' className='text-white hover:text-purple-300'>
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
