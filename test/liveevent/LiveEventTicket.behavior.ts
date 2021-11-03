import { expect } from "chai";

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
