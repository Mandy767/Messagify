import DashboardLayout from "@/layout/chat-layout/DashboardLayout";
import { useNavbar } from "@/store/NavbarContext";
import { useEffect } from "react";

function DashboardPage() {
    const { setIslanding } = useNavbar();

    useEffect(() => {
        setIslanding(false);
    }, [setIslanding]);

    return (
        <DashboardLayout>
            <div className="flex flex-col flex-grow p-4 bg-gray-100">
                <div className="flex-grow"> {/* Ensure full height */}
                    Hello, welcome to the dashboard!
                </div>
            </div>
        </DashboardLayout>
    );
}

export default DashboardPage;
