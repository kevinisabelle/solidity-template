import { expect } from "chai";
import { LiveEventTicket } from "../../types";

export function createNewLiveEvent(): void {
  it("should create a new event", async function () {
    await this.liveEventFactoryContract
      .connect(this.signers.concertCreator)
      .createLiveEvent("My concert", "Centre Bell", [200, 100], ["VIP", "Standard"], [10, 150], [true, false]);

    var event = await this.liveEventFactoryContract
      .connect(this.signers.concertCreator)
      .liveEvents(this.signers.concertCreator.address);

    console.log(`Event: ${event} | User: ${this.signers.concertCreator.address}`);
    // event.
    //expect(await ).to.equal(100);
  });
}

export function shouldBeCreateWithProperParameters(): void {
  it("should be created with proper parameters", async function () {
    expect(await this.liveEventTicketContract._prices(0)).to.equal(200);
    expect(await this.liveEventTicketContract.connect(this.signers.admin)._prices(1)).to.equal(100);
  });
}

export function shouldBeAbleToMintTickets(): void {
  it("should be able to mint the tickets", async function () {
    await this.liveEventTicketContract.mintTickets();
    expect(await this.liveEventTicketContract.getTotalTicketCount()).to.equal(160);
  });
}
