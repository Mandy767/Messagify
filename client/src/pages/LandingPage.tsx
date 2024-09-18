import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

import { useAuth } from '@/store/AuthContext';
import { useNavbar } from '@/store/NavbarContext';
import { useEffect } from 'react';
import PixelArtLoader from '@/components/Loader';

function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const { setIslanding } = useNavbar()

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

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2]">

            <main className="flex-grow ">
                <section id="home" className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 select-none">
                            Welcome to Messagify
                        </h2>

                        <Button
                            variant="outline"
                            onClick={() => {
                                if (isAuthenticated) {
                                    navigate('/dashboard');
                                } else {
                                    navigate('/register');
                                }
                            }}
                            className="bg-transparent border-gray-900 text-gray-900 hover:bg-gray-100 transition duration-300"
                        >
                            {isAuthenticated ? (<span>Continue...</span>) : (<span>Start Messaging ...</span>)}
                        </Button>
                    </div>
                </section>

                <section id="features" className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold mb-4 text-gray-900 select-none">Features</h2>
                        <p className="text-lg text-gray-900 select-none">Highlight the features of Chitra-AI here.</p>
                    </div>
                </section>

                <section id="contact" className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold mb-4 text-gray-900 select-none">Contact Us</h2>
                        <p className="text-lg text-gray-900 select-none">Provide contact details or a form here.</p>
                    </div>
                </section>
            </main>

        </div>
    );
}

export default LandingPage;
