import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Context } from "mocha";
import { LiveEventTicket__factory } from "../../types";

export function CreateNewLiveEvent(): void {
  it("should create a new event", async function () {
    await this.liveEventFactoryContract
      .connect(this.signers.concertCreator)
      .createLiveEvent("My concert", "Centre Bell", [200, 100], ["VIP", "Standard"], [10, 150], [true, false]);

    await connectToEvent(this.signers.concertCreator, this.signers.concertCreator.address, 0, this);

    var ticketsCount = await this.liveEventTicketContract.getTotalTicketCount();
    var mintedTickets = await this.liveEventTicketContract.getTotalTicketsMinted();
    expect(ticketsCount).to.equal(160);
    expect(mintedTickets).to.equal(0);

    var eventName = await this.liveEventTicketContract._name();
    expect(eventName).to.equal("My concert");
  });
}

export function ShouldBeAbleToMintTickets(): void {
  it("should be able to mint the tickets", async function () {
    await connectToEvent(this.signers.concertCreator, this.signers.concertCreator.address, 0, this);

    await this.liveEventTicketContract.mintTickets();
    var ticketsCount = await this.liveEventTicketContract.getTotalTicketCount();
    var mintedTickets = await this.liveEventTicketContract.getTotalTicketsMinted();

    expect(ticketsCount).to.equal(160);
    expect(mintedTickets).to.equal(160);

    await expect(this.liveEventTicketContract.mintTickets()).to.be.revertedWith("No more tickets to mint");
  });
}

export function ConcertCreatorPutTicketsForSell(): void {
  it("should create a new event", async function () {
    await connectToEvent(this.signers.concertCreator, this.signers.concertCreator.address, 0, this);

    await this.liveEventTicketContract.setTicketsForSale(0, 5, 200);
    await this.liveEventTicketContract.setTicketsForSale(1, 100, 100);

    var ticketsForSale = await this.liveEventTicketContract.getTicketsForSale();
    expect(ticketsForSale.length).to.equal(2);
    expect(ticketsForSale.filter(s => s.seller === this.signers.concertCreator.address).length).to.equal(2);
    var totalTicketsForSale = ticketsForSale.map(t => t.amount).reduce((a, p) => a.add(p));
    expect(totalTicketsForSale).to.equal(105);

    await this.liveEventTicketContract.setTicketsForSale(0, 5, 300);

    var ticketsForSale = await this.liveEventTicketContract.getTicketsForSale();
    expect(ticketsForSale.filter(s => s.seller === this.signers.concertCreator.address).length).to.equal(2);
    totalTicketsForSale = ticketsForSale.map(t => t.amount).reduce((a, p) => a.add(p));
    expect(totalTicketsForSale).to.equal(110);
  });
}

export function UserShouldBeAbleToBuyATicket(): void {
  it("user should be able to buy tickets", async function () {
    await connectToEvent(this.signers.user1, this.signers.concertCreator.address, 0, this);

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

export function User1ResellTicketToUser2(): void {
  it("user should be able to resell their tickets.", async function () {
    await connectToEvent(this.signers.user1, this.signers.concertCreator.address, 0, this);

    await this.liveEventTicketContract.setTicketsForSale(0, 1, 400);

    var user1OldBalance = await this.signers.user1.getBalance();

    await connectToEvent(this.signers.user2, this.signers.concertCreator.address, 0, this);

    var amount = await this.liveEventTicketContract.buyTicket(this.signers.user1.address, 1, 0, {
      value: 400,
    });

    var contractBalance = await this.liveEventTicketContract._contractBalance();
    expect(contractBalance).to.equal(600);
    var user1NewBalance = await this.signers.user1.getBalance();
    var differenceBalanceUser1 = user1NewBalance.toBigInt() - user1OldBalance.toBigInt();
    expect(differenceBalanceUser1).to.equal(BigInt(400));
  });
}

export function TransfertTickets(): void {
  it("user1 should be able to transfer tickets to user2", async function () {
    await connectToEvent(this.signers.user1, this.signers.concertCreator.address, 0, this);

    await this.liveEventTicketContract.transfertTicket(this.signers.user2.address, 0, 1);
    var user1OldBalance = await this.signers.user1.getBalance();

    await connectToEvent(this.signers.user2, this.signers.concertCreator.address, 0, this);

    var contractBalance = await this.liveEventTicketContract._contractBalance();
    expect(contractBalance).to.equal(600);

    var user1NewBalance = await this.signers.user1.getBalance();
    var differenceBalanceUser1 = user1NewBalance.toBigInt() - user1OldBalance.toBigInt();
    expect(differenceBalanceUser1).to.equal(BigInt(0));
  });
}

export function UsersAttendEvent(): void {
  it("user1 and user2 attend event", async function () {
    await connectToEvent(this.signers.user1, this.signers.concertCreator.address, 0, this);

    var attendanceCount = await this.liveEventTicketContract.getAttendanceCount();
    expect(attendanceCount).to.equal(0);

    await this.liveEventTicketContract.attendEvent(0);

    var attendanceCount = await this.liveEventTicketContract.getAttendanceCount();
    expect(attendanceCount).to.equal(1);

    await connectToEvent(this.signers.user2, this.signers.concertCreator.address, 0, this);

    var attendanceCount = await this.liveEventTicketContract.getAttendanceCount();
    expect(attendanceCount).to.equal(0);

    await this.liveEventTicketContract.attendEvent(0);

    var attendanceCount = await this.liveEventTicketContract.getAttendanceCount();
    expect(attendanceCount).to.equal(1);
  });
}

export function ConcertCreatorRetrieveFundsAfterEvent(): void {
  it("concert creator should be able to retrieve funds", async function () {
    await connectToEvent(this.signers.concertCreator, this.signers.concertCreator.address, 0, this);
  });
}

async function connectToEvent(user: SignerWithAddress, eventCreator: string, eventIndex: number, context: Context) {
  var event = await context.liveEventFactoryContract.connect(user).getEvent(eventCreator, eventIndex);
  context.liveEventTicketContract = LiveEventTicket__factory.connect(event, user);
}
