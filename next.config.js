/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Ignore MongoDB's optional dependencies warnings
    config.ignoreWarnings = [
      { module: /mongodb/ },
      { message: /mongodb/ }
    ];
    return config;
  }
};

module.exports = nextConfig; 