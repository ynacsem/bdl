'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function NavigationMenu() {
    return (
        <nav className="bg-white p-4 shadow-xl">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Image src="/images.png" alt="BDL Logo" width={40} height={40} />
                    <span className="text-secondary text-lg font-bold ml-3">BDL</span>
                </div>
                <div>
                    <ul className="flex space-x-6">
                        <li>
                            <Link href="./facture/saisieFacture">
                                <div className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                                    Saisie Facture
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="./facture/modifier">
                                <div className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                                    Modify Facture
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
