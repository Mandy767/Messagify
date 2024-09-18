import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/AuthContext';
import { useNavbar } from '@/store/NavbarContext';
import PixelArtLoader from '@/components/Loader';
import { MessageSquare, Users, Zap, ChevronDown } from 'lucide-react';

function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const { setIslanding } = useNavbar();

    useEffect(() => {
        setIslanding(true);
    }, [setIslanding]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <PixelArtLoader />
            </div>
        );
    }

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 text-gray-900">
            <main>
                <section id="home" className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-blue-900 animate-fade-in-down">
                            Welcome to Messagify
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-800 animate-fade-in-up">
                            Connect, chat, and share moments with friends around the world.
                        </p>
                        <Button
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 animate-pulse"
                        >
                            {isAuthenticated ? 'Continue to Dashboard' : 'Start Messaging Now'}
                        </Button>
                        <div className="mt-12 animate-bounce">
                            <ChevronDown
                                size={40}
                                onClick={() => scrollTo('features')}
                                className="mx-auto cursor-pointer text-blue-700 hover:text-blue-900 transition-colors duration-300"
                            />
                        </div>
                    </div>
                </section>

                <section id="features" className="min-h-screen flex items-center justify-center px-4 bg-white bg-opacity-80">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-blue-900">Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[
                                { icon: MessageSquare, title: 'Real-time Messaging', description: 'Instant communication with friends and family.' },
                                { icon: Users, title: 'Group Chats', description: 'Create and manage group conversations easily.' },
                                { icon: Zap, title: 'Fast & Secure', description: 'Lightning-fast messaging with end-to-end encryption.' },
                            ].map((feature, index) => (
                                <div key={index} className="bg-blue-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                                    <feature.icon size={48} className="mx-auto mb-4 text-blue-600" />
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-700">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 animate-bounce">
                            <ChevronDown
                                size={40}
                                onClick={() => scrollTo('contact')}
                                className="mx-auto cursor-pointer text-blue-700 hover:text-blue-900 transition-colors duration-300"
                            />
                        </div>
                    </div>
                </section>

                <section id="contact" className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-blue-900">Get in Touch</h2>
                        <p className="text-xl mb-8 text-blue-800">
                            Have questions or feedback? We'd love to hear from you!
                        </p>
                        <form className="space-y-4">
                            <input type="email" placeholder="Your Email" className="w-full p-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none" />
                            <textarea placeholder="Your Message" rows={4} className="w-full p-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none"></textarea>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-lg transition duration-300">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LandingPage;