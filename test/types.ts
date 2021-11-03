import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { LiveEventFactory, LiveEventTicket } from "../types";
declare module "mocha" {
  export interface Context {
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    liveEventTicketContract: LiveEventTicket;
    liveEventFactoryContract: LiveEventFactory;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  concertCreator: SignerWithAddress;
  user1: SignerWithAddress;
  user2: SignerWithAddress;
}
