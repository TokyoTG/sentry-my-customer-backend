const mongoose=require('mongoose');
const axios=require('axios')
require("dotenv").config();
const { MONGOLAB_URI, API_PORT } = process.env;

describe('All app', () => {

  /*beforeAll(async () => {
    await mongoose.connect(MONGOLAB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });*/

  /*afterEach(async () => {
    await Customer.deleteMany()
  });*/

  test('get token', async done => {
    // Sends request...
    let res = await axios.post(`http://localhost:${API_PORT}/login/user`, {
      "phone_number": "670224091",
      "password": "123456789"
    });

    expect(res.data).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        api_token: expect.any(String),
        status: true,
        user: expect.objectContaining({
          _id: expect.any(String),
          phone_number: expect.any(Number),
          first_name: expect.any(String),
          last_name: expect.any(String),
          email: expect.any(String),
          is_active: false,
          password: expect.any(String),
          user_role: expect.any(String)
        }),
      }),
    );

    done()
  });
});