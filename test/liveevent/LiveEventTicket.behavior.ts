import { expect } from "chai";
import { LiveEventTicket__factory } from "../../types";

export function createNewLiveEvent(): void {
  it("should create a new event", async function () {
    await this.liveEventFactoryContract
      .connect(this.signers.concertCreator)
      .createLiveEvent("My concert", "Centre Bell", [200, 100], ["VIP", "Standard"], [10, 150], [true, false]);

    var event = await this.liveEventFactoryContract
      .connect(this.signers.user1)
      .getEvent(this.signers.concertCreator.address, 0);
    this.liveEventTicketContract = LiveEventTicket__factory.connect(event, this.signers.user1);

    var ticketsCount = await this.liveEventTicketContract.getTotalTicketCount();
    var mintedTickets = await this.liveEventTicketContract.getTotalTicketsMinted();

    expect(ticketsCount).to.equal(160);
    expect(mintedTickets).to.equal(0);

    var eventName = await this.liveEventTicketContract._name();

    expect(eventName).to.equal("My concert");

    console.log(`Event: ${event} | User: ${this.signers.concertCreator.address}`);
  });
}

export function shouldBeAbleToMintTickets(): void {
  it("should be able to mint the tickets", async function () {
    var event = await this.liveEventFactoryContract
      .connect(this.signers.concertCreator)
      .getEvent(this.signers.concertCreator.address, 0);
    this.liveEventTicketContract = LiveEventTicket__factory.connect(event, this.signers.concertCreator);

    await this.liveEventTicketContract.mintTickets();
    var ticketsCount = await this.liveEventTicketContract.getTotalTicketCount();
    var mintedTickets = await this.liveEventTicketContract.getTotalTicketsMinted();

    expect(ticketsCount).to.equal(160);
    expect(mintedTickets).to.equal(160);

    await expect(this.liveEventTicketContract.mintTickets()).to.be.revertedWith("No more tickets to mint");
  });
}

export function concertCreatorPutTicketsForSell(): void {
  it("should create a new event", async function () {
    var event = await this.liveEventFactoryContract
      .connect(this.signers.concertCreator)
      .getEvent(this.signers.concertCreator.address, 0);
    this.liveEventTicketContract = LiveEventTicket__factory.connect(event, this.signers.concertCreator);

    await this.liveEventTicketContract.setTicketsForSale(0, 5, 200);
    await this.liveEventTicketContract.setTicketsForSale(1, 100, 100);

    var ticketsForSale = await this.liveEventTicketContract.getTicketsForSale();

    expect(ticketsForSale.length).to.equal(2);
    expect(ticketsForSale.filter(s => s.seller === this.signers.concertCreator.address).length).to.equal(2);

    var totalTicketsForSale = ticketsForSale.map(t => t.amount).reduce((a, p) => a.add(p));

    expect(totalTicketsForSale).to.equal(105);

    console.log("Tickets for sale: " + totalTicketsForSale);

    await this.liveEventTicketContract.setTicketsForSale(0, 5, 300);

    var ticketsForSale = await this.liveEventTicketContract.getTicketsForSale();
    expect(ticketsForSale.filter(s => s.seller === this.signers.concertCreator.address).length).to.equal(2);

    totalTicketsForSale = ticketsForSale.map(t => t.amount).reduce((a, p) => a.add(p));

    console.log("Tickets for sale: " + totalTicketsForSale);

    expect(totalTicketsForSale).to.equal(110);
  });
}

export function UserShouldBeAbleToBuyATicket(): void {
  it("user should be able to buy tickets", async function () {
    var event = await this.liveEventFactoryContract
      .connect(this.signers.user1)
      .getEvent(this.signers.concertCreator.address, 0);
    this.liveEventTicketContract = LiveEventTicket__factory.connect(event, this.signers.user1);

    var ticketsForSale = await this.liveEventTicketContract.getTicketsForSale();
    var totalTicketsForSale = ticketsForSale.map(t => t.amount).reduce((a, p) => a.add(p));
    expect(totalTicketsForSale).to.equal(110);

    var amount = await this.liveEventTicketContract.buyTicket(this.signers.concertCreator.address, 2, 0, {
      value: 600,
    });

    var userAmount = await this.liveEventTicketContract.balanceOf(this.signers.user1.address, 0);

    expect(userAmount).to.equal(2);

    ticketsForSale = await this.liveEventTicketContract.getTicketsForSale();
    totalTicketsForSale = ticketsForSale.map(t => t.amount).reduce((a, p) => a.add(p));
    expect(totalTicketsForSale).to.equal(108);

    var contractBalance = await this.liveEventTicketContract._contractBalance();

    expect(contractBalance).to.equal(600);
  });
}

export function resellTickets(): void {
  it("should create a new event", async function () {});
}

export function transfertTickets(): void {
  it("should create a new event", async function () {});
}

export function attendEvent(): void {
  it("should create a new event", async function () {});
}

export function concertCreatorRetrieveFundsAfterEvent(): void {
  it("should create a new event", async function () {});
}
