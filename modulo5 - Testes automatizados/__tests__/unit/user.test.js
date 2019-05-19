const bcrypt = require("bcrypt");

const factory = require("../factories");
const truncate = require("../utils/truncate");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("shuld encrypt user password", async () => {
    const user = await factory.create("User", {
      password: "123456"
    });
    // espera qu a senha seha encryptada
    const compareHash = await bcrypt.compare("123456", user.password_hash);

    expect(compareHash).toBe(true);
  });
});
