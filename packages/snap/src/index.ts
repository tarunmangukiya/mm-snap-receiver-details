import { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { getAddressDetails } from './api';

// declare let window: any;

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const details = [];

  // Get receiver address details.
  const addressDetails = await getAddressDetails(
    chainId,
    transaction.to as `0x${string}`,
    transaction.data?.toString(),
  );

  // Transaction Count
  if (Number(addressDetails.transactionCount) === 0) {
    details.push(
      text(
        `⚠️ Receiver seems to be receiving their first transaction. Make sure you are sending funds to the right address.`,
      ),
    );
  }

  // Gnosis Safe
  if (addressDetails.isGnosisSafe) {
    details.push(text(`✅ Receiver is a Gnosis Safe address.`));
  }
  // Contract
  else if (addressDetails.isContract) {
    details.push(
      text(
        `⚠️ Receiver is a smart contract address. Make sure you are sending funds to the right address.`,
      ),
    );
  }

  // ================================
  // Receiver Details
  // ================================
  // Lens
  addressDetails.lens?.items?.forEach((lens: any) => {
    details.push(text(`Lens Profile: ${lens.name} (${lens.handle})`));
  });

  // Ens
  const ens = addressDetails.ensName;
  if (ens) {
    details.push(text(`ENS: ${ens}`));
  }

  // Ens
  const { ud } = addressDetails;
  if (ud) {
    details.push(text(`Unstoppable Domain: ${ud}`));
  }

  // Address
  let receiver = transaction.to;
  if (addressDetails.erc20TransferDetails?.args?.length) {
    receiver = addressDetails.erc20TransferDetails.args[0];

    details.push(text(`Address: ${receiver}`));
  }

  // Display percentage of gas fees in the transaction insights UI.
  return {
    content: panel(details),
  };
};
