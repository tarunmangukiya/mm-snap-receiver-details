const API_BASE = process.env.SNAP_API;

export const getAddressDetails = async (
  chainId: string,
  address: `0x${string}`,
  inputData = '',
) => {
  const response = await fetch(
    `${API_BASE}/snap/address/${address}?inputData=${inputData}&chainId=${chainId}`,
  );
  return response.json();
};
