import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const getDeviceType = async () => {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  return {
    isMobile: device.type === "mobile" || device.type === "tablet",
  };
};
