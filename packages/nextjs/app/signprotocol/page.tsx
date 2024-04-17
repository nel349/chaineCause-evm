// Create simple component with a button that will trigger the sign protocol
import React from "react";
import { EvmChains, IndexService, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { createWalletClient, custom } from "viem";
import { base } from "viem/chains";

export const SignProtocolComponent = () => {
  const walletClient = createWalletClient({
    chain: base,
    transport: custom(window.ethereum!),
  });

  const signProtocol = async () => {
    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.base,
      walletClient,
      //   account: privateKeyToAccount(privateKey)
    });

    // onchain_evm_84532_0x63 testnet

    // onchain_evm_8453_0x7 mainnet

    async function getSchemaFromIndexService() {
      const indexService = new IndexService("mainnet");
      const res = await indexService.querySchema("onchain_evm_8453_0x7");
      console.log("getSchemaFromIndexService: ", res);
    }

    await getSchemaFromIndexService();

    const publicKey = (await walletClient.getAddresses())[0].toString();

    //create attestation
    const attestationInfo = await client.createAttestation({
      schemaId: "0x7", //schemaInfo.schemaId or other schemaId
      data: {
        signer: ["0x9584DD0D9bA9d81103020281B77EA23cAaC4e3A4"],
      },
      indexingValue: publicKey.toLowerCase() || "",
      recipients: ["0xe119584dd81d99eff581AED4D22B962D6CbEB426"],
    });

    console.log("attestationInfo: ", attestationInfo);
  };

  return (
    <button onClick={signProtocol} className="btn btn-primary">
      Sign Protocol
    </button>
  );
};
