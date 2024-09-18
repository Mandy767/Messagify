import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//@ts-ignore
import { Link } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Button } from './ui/button';
import { useAuth } from '@/store/AuthContext';
import { useNavbar } from '@/store/NavbarContext';
import { Loader } from 'lucide-react';
import LogoutModal from '@/components/LogoutModal';
import PixelArtLoader from './Loader';

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { islanding } = useNavbar()
    const { isAuthenticated, user, isLoading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <PixelArtLoader />

            </div>
        );
    }
    const handleLogout = async () => {
        setIsDropdownOpen(false);
        setIsModalOpen(true);
    };

    const confirmLogout = async () => {
        setIsModalOpen(false);
        await logout();
        navigate('/');
    };
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] text-gray-600 shadow-md z-50">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/speech-bubble.png" alt="Logo" className="h-8 w-8 mr-2" />
                        <h1 className="text-2xl font-bold text-gray-900 select-none">
                            Messagify
                        </h1>
                    </div>

                    <div className="md:hidden flex items-center justify-center">
                        <div onClick={toggleMenu}>
                            {isOpen ? (
                                <FaTimes size={24} />
                            ) : isAuthenticated ? (
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-900">
                                        <img
                                            src={import.meta.env.VITE_SERVER_ENDPOINT + "/" + user?.profilepic}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <FaBars size={24} />
                            )}

                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {islanding && (
                            <>
                                <Link to="home" smooth={true} duration={500} className="hover:text-black text-gray-800 cursor-pointer">
                                    Home
                                </Link>
                                <Link to="features" smooth={true} duration={500} className="hover:text-black text-gray-800 cursor-pointer">
                                    Features
                                </Link>
                                <Link to="contact" smooth={true} duration={500} className="hover:text-black text-gray-800 cursor-pointer">
                                    Contact
                                </Link>
                            </>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center">

                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-900">
                                    <img src={import.meta.env.VITE_SERVER_ENDPOINT + "/" + user?.profilepic} alt="Profile" className="w-full h-full object-cover" />
                                </div>

                                <div className="ml-4 relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center text-gray-900 font-semibold">
                                        <span>{user?.name}</span>
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-4 p-1">
                                <Button className="border-black h-8" variant="outline" onClick={() => {
                                    toggleMenu()
                                    navigate('/login')
                                }}>Login</Button>
                                <Button className="h-8" onClick={() => {
                                    toggleMenu()
                                    navigate('/register')
                                }}>Register</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <ul className="md:hidden flex flex-col items-center bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] text-gray-800 py-4 shadow-lg rounded-lg">
                        <div className="w-full border-b-2 border-gray-300 mb-2"></div>
                        {islanding && (
                            <>
                                <li className="w-full text-center py-3 border-b-2 border-gray-300">
                                    <Link
                                        onClick={toggleMenu}
                                        to="home"
                                        smooth={true}
                                        duration={500}
                                        className="hover:text-blue-600 text-gray-800 cursor-pointer block w-full transition-colors duration-300"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="w-full text-center py-3 border-b-2 border-gray-300">
                                    <Link
                                        onClick={toggleMenu}
                                        to="features"
                                        smooth={true}
                                        duration={500}
                                        className="hover:text-blue-600 text-gray-800 cursor-pointer block w-full transition-colors duration-300"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li className="w-full text-center py-3 border-b-2 border-gray-300">
                                    <Link
                                        onClick={toggleMenu}
                                        to="contact"
                                        smooth={true}
                                        duration={500}
                                        className="hover:text-blue-600 text-gray-800 cursor-pointer block w-full transition-colors duration-300"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </>
                        )}

                        {isAuthenticated ? (
                            <li className="w-full text-center py-3">
                                <Button className="border-black h-8" onClick={handleLogout}>Logout</Button>
                            </li>
                        ) : (
                            <>
                                <li className="w-full text-center py-3 border-b-2 border-gray-300">
                                    <Button
                                        variant="outline"
                                        className="border-black py-2 px-6 rounded-md shadow-md "
                                        onClick={() => {
                                            toggleMenu();
                                            navigate('/login');
                                        }}
                                    >
                                        Login
                                    </Button>
                                </li>
                                <li className="w-full text-center py-3">
                                    <Button
                                        className="py-2 px-6 rounded-md shadow-md "
                                        onClick={() => {
                                            toggleMenu()
                                            navigate('/register')
                                        }}
                                    >
                                        Register
                                    </Button>
                                </li>
                            </>
                        )}
                    </ul>
                )}
            </nav >
            <LogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmLogout}
            />
        </>
    );
}

export default Navbar;
