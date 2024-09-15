const useHttpRequest = () => {
    const sendRequest = async (URI, config = {}) => {
        try {
            const endpoint = import.meta.env.VITE_SERVER_ENDPOINT + URI;
            console.log(endpoint);
            const response = await fetch(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    ...config?.headers,
                    accept: "application/json",
                },
                credentials: "include",
                ...config,
            });
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            return { data };
        } catch (error) {
            return {
                error,
            };
        }
    };

    return sendRequest;
};

export { useHttpRequest };
