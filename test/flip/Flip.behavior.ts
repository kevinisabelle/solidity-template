import { expect } from "chai";

export function shouldBeFunded(): void {
  it("should be funded after calling the function", async function () {
    expect(await this.flipContract.contractBalance()).to.equal(0);
    await this.flipContract.fundContract({ value: 100 });
    expect(await this.flipContract.connect(this.signers.admin).contractBalance()).to.equal(100);
  });
}
