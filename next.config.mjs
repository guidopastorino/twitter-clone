// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/i",
        permanent: true,
      },
      {
        source: "/compose/post",
        destination: "/i",
        permanent: true,
      },
      {
        source: "/feed-options",
        destination: "/i",
        permanent: true,
      },
      {
        source: "/comment/post",
        destination: "/i",
        permanent: true
      }
    ];
  },
  // serverComponentsExternalPackages: ["mongoose"],
};

export default nextConfig;