function Footer() {
    return (
        <footer className="bg-gray-500 text-white py-4">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                <p className="text-sm mt-2">
                    <a href="#" className="hover:underline">Privacy Policy</a> |{" "}
                    <a href="#" className="hover:underline">Terms of Service</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;