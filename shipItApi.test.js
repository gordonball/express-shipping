"use strict";

const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");

const axiosMock = new AxiosMockAdapter(axios);


const {
  shipProduct,
} = require("./shipItApi");


test("shipProduct", async function () {

  axiosMock.onPost("http://localhost:3001/ship")
    .reply(200, {
      receipt: {
        itemId: 1001,
        name: 'stuff',
        addr: '123 blah street',
        shipId: 1
      }
})

  const shipId = await shipProduct({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  });

  console.log("SHIP ID", shipId)

  expect(shipId).toEqual(1);
});


