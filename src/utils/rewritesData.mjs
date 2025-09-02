// rewritesData.mjs
const rewritesList = [
    {
        source: '/Prod-images/:slug*',
        destination: '/api/images/:slug*',
    },
    {
        source: '/Prod-images/:path*',
        destination: '/api/images/:path*',
    }
];


export default rewritesList;