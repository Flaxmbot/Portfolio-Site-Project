const nextConfig = {
  productionBrowserSourceMaps: process.env.NODE_ENV === "production",
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack: (config, options) => {
    // Enable source maps only in development
    // Use 'eval' instead of 'eval-source-map' to avoid performance issues
    config.devtool = options.dev ? 'eval' : false;
    
    // Enable production optimization (minification)
    if (!options.dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    
    // Handle webpack warnings from dependencies
    config.ignoreWarnings = [
      // Ignore OpenTelemetry critical dependency warnings
      /Critical dependency: the request of a dependency is an expression/,
      // Ignore Handlebars require.extensions warnings
      /require\.extensions is not supported by webpack/,
    ];
    
    // Suppress specific module warnings
    config.module = config.module || {};
    config.module.unknownContextCritical = false;
    config.module.unknownContextRegExp = /^\.\/.*$/;
    config.module.unknownContextRequest = '.';
    
    config.plugins = config.plugins || [];
    config.module.rules = config.module.rules || [];

    const fileLoaderRule = config.module.rules.find(
      (rule) =>
        typeof rule === "object" &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg"),
    );
    if (fileLoaderRule && typeof fileLoaderRule === "object") {
      fileLoaderRule.exclude = /\.svg$/i;
    }
    config.module.rules.push(
      {
        test: /\.svg$/i,
        resourceQuery: /url/,
        type: "asset/resource",
      },
      //      {
      //        test: /\.svg$/i,
      //        issuer: /\.[jt]sx?$/,
      //        resourceQuery: { not: [/url/] },
      //        use: ["@svgr/webpack"],
      //      }
    );

    return config;
  },
};

export default nextConfig;
