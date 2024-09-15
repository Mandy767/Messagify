import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] text-gray-600 shadow-md z-50">
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Logo and title */}
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/speech-bubble.png" alt="Logo" className="h-8 w-8 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-900 select-none">
                        Messagify
                    </h1>
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu}>
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Links for larger screens */}
                <ul className="hidden md:flex space-x-6">
                    <li>
                        <Link to="home" smooth={true} duration={500} className="hover:text-black text-gray-800 cursor-pointer">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="features" smooth={true} duration={500} className="hover:text-black text-gray-800 cursor-pointer">
                            Features
                        </Link>
                    </li>
                    <li>
                        <Link to="contact" smooth={true} duration={500} className="hover:text-black text-gray-800 cursor-pointer">
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Dropdown Menu for Mobile */}
            {isOpen && (
                <ul className="md:hidden flex flex-col items-center bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] text-gray-800 py-2 shadow-md ">
                    <li className="py-2 w-full text-center border-b-2">
                        <Link
                            onClick={toggleMenu}
                            to="home"
                            smooth={true}
                            duration={500}
                            className="hover:text-black text-gray-800 cursor-pointer block w-full"
                        >
                            Home
                        </Link>
                    </li>
                    <li className="py-2 w-full text-center border-b-2">
                        <Link
                            onClick={toggleMenu}
                            to="features"
                            smooth={true}
                            duration={500}
                            className="hover:text-black text-gray-800 cursor-pointer block w-full"
                        >
                            Features
                        </Link>
                    </li>
                    <li className="py-2 w-full text-center">
                        <Link
                            onClick={toggleMenu}
                            to="contact"
                            smooth={true}
                            duration={500}
                            className="hover:text-black text-gray-800 cursor-pointer block w-full"
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    );
}

export default Navbar;
