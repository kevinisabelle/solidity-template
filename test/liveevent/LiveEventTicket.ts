import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { LiveEventTicket } from "../../types/LiveEventTicket";
import type { LiveEventFactory } from "../../types/LiveEventFactory";
import { Signers } from "../types";
import {
  shouldBeCreateWithProperParameters,
  shouldBeAbleToMintTickets,
  createNewLiveEvent,
} from "./LiveEventTicket.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.concertCreator = signers[1];
    this.signers.user1 = signers[2];
    this.signers.user2 = signers[3];
  });

  describe("LiveEventTicketContract", function () {
    before(async function () {
      const LiveEventTicketContractArtifact: Artifact = await artifacts.readArtifact("LiveEventTicket");
      const LiveEventFactoryArtifact: Artifact = await artifacts.readArtifact("LiveEventFactory");

      this.liveEventFactoryContract = <LiveEventFactory>(
        await waffle.deployContract(this.signers.admin, LiveEventFactoryArtifact, [])
      );
    });

    createNewLiveEvent();
    // shouldBeCreateWithProperParameters();
    // shouldBeAbleToMintTickets();
  });
});
