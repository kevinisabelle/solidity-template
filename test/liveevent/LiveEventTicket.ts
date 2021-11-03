import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { LiveEventTicket } from "../../types/LiveEventTicket";
import { Signers } from "../types";
import { shouldBeCreateWithProperParameters, shouldBeAbleToMintTickets } from "./LiveEventTicket.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("LiveEventTicketContract", function () {
    before(async function () {
      const LiveEventTicketContractArtifact: Artifact = await artifacts.readArtifact("LiveEventTicket");
      this.liveEventTicketContract = <LiveEventTicket>(
        await waffle.deployContract(this.signers.admin, LiveEventTicketContractArtifact, [
          "My concert",
          "Centre Bell",
          [200, 100],
          ["VIP", "Standard"],
          [10, 150],
          [true, false],
        ])
      );
    });

    shouldBeCreateWithProperParameters();
    shouldBeAbleToMintTickets();
  });
});
