import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
const cdnHostname = cdnUrl ? new URL(cdnUrl).hostname : null;

// S3 direct upload origin for presigned PUT URLs
const s3Bucket = process.env.AWS_S3_BUCKET;
const s3Region = process.env.AWS_S3_REGION ?? "us-east-1";
const s3Origin = s3Bucket
  ? `https://${s3Bucket}.s3.${s3Region}.amazonaws.com`
  : null;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typedRoutes: false,
  images: {
    qualities: [75],
    remotePatterns: [
      ...(cdnHostname
        ? [
            {
              protocol: "https" as const,
              hostname: cdnHostname,
              pathname: "/**",
            },
          ]
        : []),
      {
        protocol: "https" as const,
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "media.discordapp.net",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "date-fns",
      "lucide-react",
      "react-icons",
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
      "flag-icons",
      "@bellona/core",
    ],
  },
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiOrigin = apiUrl ? new URL(apiUrl).origin : "";

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              `img-src 'self' data: blob: cdn.discordapp.com${cdnHostname ? ` https://${cdnHostname}` : ""}`,

              "font-src 'self' data: fonts.gstatic.com",
              `connect-src 'self' vitals.vercel-insights.com va.vercel-insights.com ${apiOrigin}${s3Origin ? ` ${s3Origin}` : ""}`.trim(),
              "frame-ancestors 'none'",
              ...(process.env.NODE_ENV === "production"
                ? ["upgrade-insecure-requests"]
                : []),
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
