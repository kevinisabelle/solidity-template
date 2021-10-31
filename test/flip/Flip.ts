import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { FlipContract } from "../../types/FlipContract";
import { Signers } from "../types";
import { shouldBeFunded } from "./Flip.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("FlipContract", function () {
    beforeEach(async function () {
      const flipContractArtifact: Artifact = await artifacts.readArtifact("FlipContract");
      this.flipContract = <FlipContract>await waffle.deployContract(this.signers.admin, flipContractArtifact, []);
    });

    shouldBeFunded();
  });
});
