/** @type {import('next').NextConfig} */
const nextConfig = {
    // Causing a lot of Clerk issues
    /*
    async redirects() {
        return [
            {
                source: "/",
                destination: "/prospecting",
                permanent: true,
            },
        ];
    },
    */
};

export default nextConfig;
