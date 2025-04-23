'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContexts';
import { Eye, EyeSlash } from 'iconsax-react';

interface LoginForm {
    email: string;
    password: string;
}

export default function SignIn() {
    const { login: loginAuth } = useAuth();
    const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login(formData.email, formData.password);
            await loginAuth(response.token);

            if (response.role === 'super-admin' || response.role === 'admin') {
                toast({
                    title: 'Login Successful',
                    description: 'Welcome, Admin!',
                });
                router.push('/admin');
            } else {
                toast({
                    title: 'Unauthorized Access',
                    description: 'You do not have permission to access this page.',
                });
            }
        } catch (err) {
            console.error(err);
            toast({
                title: 'Login Failed',
                description: 'Invalid username or password.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-100"
            style={{
                backgroundImage: 'url("/images/loginBg.svg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex flex-col justify-center items-center bg-opacity-30 shadow-xl backdrop-blur-lg max-w-full sm:max-w-3xl w-full bg-white sm:shadow-box sm:rounded-3xl py-10 sm:py-16 sm:mx-5 sm:my-auto px-4 sm:px-0">
                <img  onClick={() => router.push("/")} alt={'logo'} loading={'lazy'} width={180} height={105} data-nimg="1" src="/Logo.png" />
                <h1 className="text-2xl font-extrabold my-6 text-center text-secondary-50">Welcome to Ruqya Admin</h1>
                <form onSubmit={handleSubmit} className="w-3/5">
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full h-12 px-3 py-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:bg-primary-50 focus:border-primary-400"
                        />
                    </div>
                    <div className="relative mt-5">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full h-12 px-3 py-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:bg-primary-50 focus:border-primary-400 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-5 flex items-center text-gray-600"
                        >
                            {showPassword ?
                                <EyeSlash size="15"  color="#474747"/>
                                :
                                <Eye size="15" color="#474747" />}
                        </button>
                    </div>
                    <p className="mt-3 text-sm cursor-pointer text-[#474747]" onClick={() => router.push("/forgot-password")}>Forgot Password?</p>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full flex justify-center mt-5 py-2 px-6 h-10 border border-transparent rounded-2xl shadow-sm text-m font-bold text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:to-primary-400"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Continue with email ...' : 'Continue with email'}
                    </button>
                </form>
            </div>
        </div>
    );
}
