export function splitAddress(address: string): { host: string; port: number; type: 4 | 6 } {
  return {
    host: address
      .split(":")
      .slice(0, address.split(":").length - 1)
      .join(":")
      .replace("[", "")
      .replace("]", ""),
    port: parseInt(address.split(":")[address.split(":").length - 1]),
    type: address.includes("[") ? 6 : 4,
  };
}
