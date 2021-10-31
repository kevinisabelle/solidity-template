import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { FlipContract } from "../types";
import type { Greeter } from "../types/Greeter";
declare module "mocha" {
  export interface Context {
    greeter: Greeter;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    flipContract: FlipContract;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
