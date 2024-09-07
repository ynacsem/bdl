'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function NavigationMenu() {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        window.location.href = '/login'; // Redirect to the login page after sign out
    };

    return (
        <nav className="bg-white shadow-xl">
            <div className="container mx-auto flex justify-between items-center h-16"> {/* Adjusted height */}
                <div className="flex items-center">
                    <Image src="/images.png" alt="BDL Logo" width={40} height={40} />
                    <span className="text-secondary text-lg font-bold ml-3">BDL</span>
                </div>
                <div className="flex items-center space-x-6">
                    { !session?.user.previleges.admin && 
                    <ul className="flex space-x-6">
                        <li>
                            <Link href="/facture/saisieFacture">
                                <div className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                                    Saisie Facture
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/facture">
                                <div className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                                    Facture
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/facture/provision">
                                <div className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                                    Provision
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/managefrs">
                                <div className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                                    manage Fournisseurs
                                </div>
                            </Link>
                        </li>
                        
                    </ul>}
                    {session && (
                        <>
                        <button
                            onClick={handleSignOut}
                            className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300"
                        >
                            Sign Out
                        </button>
                        <Link href="/ChangePassword">
                                <div className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                                ChangePassword
                                </div>
                            </Link>
                        </>
                    )}
                    {session?.user?.previleges?.admin && (
                        <>
                        <Link
                            href={"/createuser"}
                            className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300"
                        >
                            créer un utilisateur
                        </Link>
                        <Link
                            href={"/manageusers"}
                            className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                            gérer les utilisateurs
                        </Link>
                        <Link
                            href={"/creategroup"}
                            className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                            créer un groupe
                        </Link>
                        <Link
                            href={"/managegroup"}
                            className="text-primary hover:text-secondary px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-300">
                            gérer les groupes
                        </Link>
                        </>
                    )}
                    
                </div>
            </div>
        </nav>
    );
}
