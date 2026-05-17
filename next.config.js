/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Augmenter la limite de taille pour les images base64
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}

module.exports = nextConfig
