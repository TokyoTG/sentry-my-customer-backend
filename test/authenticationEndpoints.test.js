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
        success: true,
        message: "User registration successfull",
        data: {
          statusCode: 201,
          user: {
            __v: 0,
            _id: expect.any(String),
            assistants: expect.any(Array),
            facebook: expect.any(Object),
            google: expect.any(Object),
            identifier: "1",
            local: {
              api_token: expect.any(String),
              email: expect.any(String),
              first_name: expect.any(String),
              is_active: expect.any(Boolean),
              last_name: expect.any(String),
              password: expect.any(String),
              phone_number: 1,
              user_role: expect.any(String)
            },
            stores: expect.any(Array)
          }
        },
      }),
    );

    user_id = res.data.data.user._id
    api_token_register = res.data.data.user.local.api_token

    done()
  });

  test('login user', async done => {
    let res = await axios.post(`http://localhost:${API_PORT}/login/user`, {
      "phone_number": "1",
      "password": "123456"
    })

    expect(res.data).toEqual(
      expect.objectContaining({
        success: true,
        message: "You're logged in successfully.",
        data: {
          api_token: expect.any(String),
          statusCode: 200,
          user: {
            __v: 0,
            _id: user_id,
            assistants: expect.any(Array),
            facebook: expect.any(Object),
            google: expect.any(Object),
            identifier: "1",
            local: {
              api_token: expect.any(String),
              email: expect.any(String),
              first_name: expect.any(String),
              is_active: expect.any(Boolean),
              last_name: expect.any(String),
              password: expect.any(String),
              phone_number: 1,
              user_role: expect.any(String)
            },
            stores: expect.any(Array)
          }
        }
      }),
    );

    api_token_login = res.data.data.user.local.api_token

    done()
  });

  test('user delete', async done => {
    let res = await axios.delete(`http://localhost:${API_PORT}/user/delete/${user_id}`, {
      headers: {"x-access-token": api_token_register}
    })

    expect(res.data).toEqual(
      expect.objectContaining({
        success: "true",
        message: "User deleted successfully",
        error: {
          statusCode: 200,
          message: `User with id ${user_id} has been deleted `,
          data: {
            __v: 0,
            _id: user_id,
            assistants: expect.any(Array),
            facebook: expect.any(Object),
            google: expect.any(Object),
            identifier: "1",
            local: {
              api_token: expect.any(String),
              email: expect.any(String),
              first_name: expect.any(String),
              is_active: expect.any(Boolean),
              last_name: expect.any(String),
              password: expect.any(String),
              phone_number: 1,
              user_role: expect.any(String)
            },
            stores: expect.any(Array)
          }
        }
      }),
    );

    done()
  });
});