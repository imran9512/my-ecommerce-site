// rewritesData.cjs
const rewrites = [
    {
        source: '/Prod-images/:slug*',
        destination: '/api/images/:slug*',
    },
    {
        source: '/Prod-images/:path*',
        destination: '/api/images/:path*',
    }
];


module.exports = rewritesList;