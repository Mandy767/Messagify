function Footer() {
    return (
        <footer className="bg-gray-900 p-4 text-center text-white">
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