'use client';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import crypto from 'crypto';
import Link from 'next/link';

export default function LoginPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [code_user, setCodeUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        console.log(hashPassword(password));
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            code_user,
            password: hashPassword(password) // Hash the entered password
        });
        

        if (result.error) {
            setError(result.error);
        } else {
            router.push(session?.user?.previleges?.admin ? '/manageusers' : '/facture'); // Redirect to /facture
        }
    };
    const hashPassword = (password) => {
        const secret = process.env.NEXT_PUBLIC_SECRET_KEY; // Ensure SECRET_KEY is in your .env file
        return crypto.createHmac('sha256', secret).update(password).digest('hex');
    };
    

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
                <div className="flex justify-center pt-8">
                    <img src="/images.png" alt="Logo" className="w-32" />
                </div>
                {!session ? (
                    <div className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 text-center">Login</h2>
                        {error && (
                            <div className="text-red-900 border-red-500 bg-red-100 border-t-4 rounded-b px-4 py-3 shadow-md mb-4">
                                <p className="font-bold mb-2 text-sm">Login Error:</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="code_user" className="block text-sm font-medium text-gray-900">Code User</label>
                                <input
                                    type="text"
                                    id="code_user"
                                    value={code_user}
                                    onChange={(e) => setCodeUser(e.target.value)}
                                    placeholder="Code User"
                                    required
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                            <button
                                type="submit"
                                className="min-w-64 py-2 px-2 bg-purple-700 text-white rounded-md shadow-sm hover:bg-purple-600 focus:ring-2 focus:ring-indigo-600"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {session.user.username}</h2>
                        <button
                            onClick={() => signOut()}
                            className="min-w-64 py-2 px-4 bg-purple-700 text-white rounded-md shadow-sm hover:bg-purple-600 focus:ring-2 focus:ring-indigo-600"
                        >
                            Logout

                        </button>
                        <Link
                            href={session?.user?.previleges?.admin ? '/manageusers' : '/facture'}
                            className="min-w-64 py-2 px-4 bg-purple-700 text-white rounded-md shadow-sm hover:bg-purple-600 focus:ring-2 focus:ring-indigo-600"
                        >
                            home
                            
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
