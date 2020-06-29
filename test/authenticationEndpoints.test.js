const mongoose=require('mongoose');
const axios=require('axios')
require("dotenv").config();
const { MONGOLAB_URI, API_PORT } = process.env;

/** TODO: 
 * Develop test to /auth/verify and /auth/verify-phone
 */

describe('Authentication endpoints', () => {
  let api_token_register;
  let api_token_login;
  let user_id;

  test('register user', async done => {
    let res = await axios.post(`http://localhost:${API_PORT}/register/user`, {
      "first_name": "test",
      "last_name": "test",
      "phone_number": "1",
      "password": "123456",
      "email": "test@customerpay.me"
  });

    expect(res.data).toEqual(
      expect.objectContaining({
        Message: "User registered successfully...",
        User: expect.objectContaining({
          _id: expect.any(String),
          phone_number: 1,
          first_name: "test",
          last_name: "test",
          email: "test@customerpay.me",
          is_active: expect.any(Boolean),
          api_token: expect.any(String),
          user_role: expect.any(String)
        }),
      }),
    );

    user_id = res.data.User._id
    api_token_register = res.data.User.api_token

    done()
  });

  test('login user', async done => {
    let res = await axios.post(`http://localhost:${API_PORT}/login/user`, {
      "phone_number": "1",
      "password": "123456"
    })

    expect(res.data).toEqual(
      expect.objectContaining({
        message: "You're logged in successfully.",
        api_token: expect.any(String),
        status: expect.any(Boolean),
        user: expect.objectContaining({
          _id: expect.any(String),
          phone_number: 1,
          first_name: "test",
          last_name: "test",
          email: "test@customerpay.me",
          is_active: expect.any(Boolean),
          password: expect.any(String),
          user_role: expect.any(String)
        }),
      }),
    );

    api_token_login = res.data.api_token

    done()
  });

  test('user delete', async done => {
    let res = await axios.delete(`http://localhost:${API_PORT}/user/delete/${user_id}`, {
      headers: {"x-access-token": api_token_register}
    })

    expect(res.data).toEqual(
      expect.objectContaining({
        message: "User deleted successfully!"
      }),
    );

    done()
  });
});