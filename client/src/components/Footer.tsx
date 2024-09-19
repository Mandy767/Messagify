
import { Heart, Twitter, Facebook, Instagram } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-2">Your Company</h3>
                        <p className="text-sm opacity-75">
                            Connecting people, one friend at a time.
                        </p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Have a nice day !!</h3>

                    </div>
                    <div className="text-center md:text-right">
                        <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                        <div className="flex justify-center md:justify-end space-x-4">
                            <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-blue-500 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                    <p className="text-sm mt-2 flex items-center justify-center">
                        Made with <Heart size={16} className="text-red-500 mx-1" /> by Your Team
                    </p>
                    <p className="text-sm mt-2">
                        <a href="#" className="hover:underline">Privacy Policy</a> |{" "}
                        <a href="#" className="hover:underline">Terms of Service</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;