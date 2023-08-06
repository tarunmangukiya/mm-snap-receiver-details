export const getAddressDetails = async (
  chainId: string,
  address: `0x${string}`,
  inputData = '',
) => {
  const response = await fetch(
    `http://localhost:3000/snap/address/${address}?inputData=${inputData}&chainId=${chainId}`,
  );
  return response.json();
};
