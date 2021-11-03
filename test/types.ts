import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { LiveEventTicket } from "../types";
declare module "mocha" {
  export interface Context {
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    liveEventTicketContract: LiveEventTicket;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
