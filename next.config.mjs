import { withFaust, getWpHostname } from '@faustwp/core';
import withMarkdoc from '@markdoc/next.js'
import withSearch from './markdoc/search.mjs'

const getAtlasCacheHandler = async ( config = {} ) => {
    if (process.env.ATLAS_CACHE_HANDLER_ENABLED === undefined || process.env.ATLAS_CACHE_HANDLER_ENABLED !== 'true') {
        return config;
    }
    
    const { atlasCacheHandler } = await import('./.atlas/atlas-cache-handler.js');

    return { ...config, ...{
        incrementalCacheHandlerPath: atlasCacheHandler,
        isrMemoryCacheSize: 0,
    } };
}
  
const nextConfig = async () => {
    return {
        reactStrictMode: true,
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
        experimental: {
            scrollRestoration: true,
            ...(await getAtlasCacheHandler()),
        },
        trailingSlash: true,
        images: {
            domains: [ getWpHostname() ],
        },
    }
};


export default withFaust( 
    withSearch( 
        withMarkdoc({
            schemaPath: './src/markdoc' 
        })( nextConfig() ) 
    ) 
);