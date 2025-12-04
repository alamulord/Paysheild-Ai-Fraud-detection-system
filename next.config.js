// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['your-supabase-url.supabase.co'], // Add your Supabase URL here
//   },
//   // Add this if you're using static exports
//   output: 'standalone', // or 'export' if you're doing static exports
//   // Add this to handle client-side routing
//   async rewrites() {
//     return [
//       {
//         source: '/:path*',
//         destination: '/:path*',
//       },
//     ]
//   },
//   // Add this to handle 404s in production
//   async redirects() {
//     return [
//       {
//         source: '/_error',
//         destination: '/404',
//         permanent: false,
//       },
//     ]
//   },
// }

// module.exports.default = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-supabase-url.supabase.co'],
  },
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/_error',
        destination: '/404',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig