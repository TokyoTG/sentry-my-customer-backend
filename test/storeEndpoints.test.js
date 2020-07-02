const mongoose=require('mongoose');
const axios=require('axios')
require("dotenv").config();
const { MONGOLAB_URI, API_PORT } = process.env;

describe('Store endpoints', () => {
  let api_token;
  let user_id;
  let store_id;

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
      "phone_number": "56932904597",
      "password": "string"
    });

    expect(res.data).toEqual(
      expect.objectContaining({
        success: true,
        message: "You're logged in successfully.",
        data: {
          api_token: expect.any(String),
          statusCode: 200,
          user: {
            "__v": expect.any(Number),
            "_id": expect.any(String),
            "local": {
                "first_name": expect.any(String),
                "last_name": expect.any(String),
                "email": expect.any(String),
                "is_active": expect.any(Boolean),
                "password": expect.any(String),
                "api_token": expect.any(String),
                "phone_number": 56932904597,
                "user_role": expect.any(String)
            },
            "google": expect.any(Object),
            "facebook": expect.any(Object),
            "assistants": expect.any(Array),
            "stores": expect.any(Array),
            "identifier": "56932904597"
          }
        }
      }),
    );

    api_token = res.data.data.api_token
    user_id = res.data.data.user._id

    done()
  });

  test('store new', async done => {
    let res = await axios.post(`http://localhost:${API_PORT}/store/new/${user_id}`, {
      "shop_address": "test",
      "store_name": "test"
  }, {
      headers: {"x-access-token": api_token}
    });

    expect(res.data).toEqual(
      expect.objectContaining({
        success: true,
        message: "Store added successfully",
        data: {
          statusCode: 201,
          store: {
            _id: expect.any(String),
            email: "Not set",
            store_name: "test",
            shop_address: "test",
            store_admin: user_id,
            __v: 0
          }
        }
    }),
    );

    store_id = res.data.data.store._id

    done()
  });

  /*test('customer all', async done => {
    let res = await axios.get(`http://localhost:${API_PORT}/customer/all`, {
      headers: {"x-access-token": api_token}
    })

    expect(res.data).toEqual(
      expect.objectContaining({
        status: true,
        message: "Customers",
        data: {
          customers: expect.any(Array)
        }
      }),
    );

    res.data.data.customers.forEach(element => {
      expect(element).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
          phone_number: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      )
    });

    done()
  });

  test('customer getById', async done => {
    let res = await axios.get(`http://localhost:${API_PORT}/customer/${customer_id}`, {
      headers: {"x-access-token": api_token}
    })

    expect(res.data).toEqual(
      expect.objectContaining({
        status: true,
        message: "Customer was found",
        data: {
          customer: {
            "__v": 0,
            "_id": customer_id,
            "createdAt": expect.any(String),
            "email": "Not set",
            "name": "namet",
            "phone_number": 888888,
            "updatedAt": expect.any(String)
          }
        },
      }),
    );

    done()
  });

  test('customer update', async done => {
    let res = await axios.put(`http://localhost:${API_PORT}/customer/update/${customer_id}`, {
      "name": "namet",
      "phone": "999"
    }, {
      headers: {"x-access-token": api_token}
    })

    expect(res.data).toEqual(
      expect.objectContaining({
        status: true,
        message: "Customer was updated",
        data: {
          customer: {
            id: customer_id,
            name: "namet",
            phone: "999"
          }
        }
      }),
    );

    done()
  });

  test('customer delete', async done => {
    let res = await axios.delete(`http://localhost:${API_PORT}/customer/delete/${customer_id}`, {
      headers: {"x-access-token": api_token}
    })

    expect(res.data).toEqual(
      expect.objectContaining({
        status: true,
        message: "Customer was deleted",
        data: {
          customer: {
            id: customer_id,
            name: "namet",
            phone: 999
          }
        },
      }),
    );

    done()
  });*/
});