/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
      'img.clerk.com',
      'subdomain',
      'files.stripe.com',
    ],
  },
  reactStrictMode: false,
}

// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'uploadthing.com'
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'utfs.io'
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'img.clerk.com'
//             },
//             {
//                 hostname: 'subdomain'
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'files.stripe.com'
//             },
//         ]
//     },
//     reactStrictMode: false
// };

export default nextConfig;
