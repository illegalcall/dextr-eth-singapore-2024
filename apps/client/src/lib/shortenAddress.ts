/**
 * Shortens a wallet address to a standard format.
 * @param address - The wallet address to shorten.
 * @returns The shortened wallet address.
 */
const shortenAddress = (address: string): string => {
    if (!address || address.length < 10) return address; // Return the original address if it's too short
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default shortenAddress;
