import type { NextConfig } from "next"

import { config } from "./lib/config"

const nextConfig: NextConfig = {
  /** Short links in WhatsApp messages (`/s/<code>`) are resolved by the API. */
  async rewrites() {
    return [
      {
        source: "/s/:code",
        destination: `${config.apiUrl.replace(/\/$/, "")}/s/:code`,
      },
    ]
  },
}

export default nextConfig