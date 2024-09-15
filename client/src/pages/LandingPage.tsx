import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '@/store/AuthContext';
import { Loader } from 'lucide-react'; // Assuming you're using the Loader component from lucide-react

function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-blue-500" size={24} /> {/* Adjust the size and color as needed */}
                <span className="ml-2 text-gray-700">Loading...</span> {/* Optional text next to the loader */}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2]">
            <Navbar islanding={true} />
            <main className="flex-grow ">
                {/* Home Section */}
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

                {/* Features Section */}
                <section id="features" className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold mb-4 text-gray-900 select-none">Features</h2>
                        <p className="text-lg text-gray-900 select-none">Highlight the features of Chitra-AI here.</p>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold mb-4 text-gray-900 select-none">Contact Us</h2>
                        <p className="text-lg text-gray-900 select-none">Provide contact details or a form here.</p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default LandingPage;
