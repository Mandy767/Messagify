import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2]">
            <Navbar />
            <main className="flex-grow ">
                {/* Home Section */}
                <section id="home" className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 select-none">
                            Welcome to Messagify
                        </h2>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/categories')}
                            className="bg-transparent border-gray-900 text-gray-900 hover:bg-gray-100 transition duration-300"
                        >
                            Get Started
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

            {/* Footer */}
            <Footer className="bg-gray-900 p-4 text-center text-white" />
        </div>
    );
}

export default LandingPage;
