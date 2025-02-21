import { PactV3 } from '@pact-foundation/pact';
import { API } from './api';
import { MatchersV3 } from '@pact-foundation/pact';
import { FactSheet } from './factSheet';
const { eachLike, like } = MatchersV3;
const Pact = PactV3;

const mockProvider = new Pact({
  consumer: 'pactflow-leanix-consumer',
  provider: process.env.PACT_PROVIDER
    ? process.env.PACT_PROVIDER
    : 'pact-leanix-graphql-provider'
});

describe('API Pact test', () => {
  describe('retrieving a factsheet', () => {
    test('ID 0241e931 exists', async () => {
      // Arrange

      const expectedFactSheet = {
        id: 'cbf30e3e-7c3d-4be8-921f-534ad8e6887e',
        name: 'ALM-DNG',
        displayName: 'ALM-DNG',
        description: 'Rational DOORS Next Generation is used for defining and managing requirements for any size development or project team. The tool also provides requirements engineering for complex systems.',
        type: 'Application',
      };

      const expectedResponse = {
        data: {
          factSheet: expectedFactSheet
        },
      };

      mockProvider
        .given('a factsheet with ID cbf30e3e-7c3d-4be8-921f-534ad8e6887e exists')
        .uponReceiving('a request to get a factsheet')
        .withRequest({
          method: 'POST',
          path: '/graphql',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: {
            query: 'query { factSheet(id: "cbf30e3e-7c3d-4be8-921f-534ad8e6887e") { id name displayName description type } }',
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: like(expectedResponse),
        });
      return mockProvider.executeTest(async (mockserver) => {
        // Act
        const api = new API(mockserver.url);
        const factSheet = await api.getFactSheet('cbf30e3e-7c3d-4be8-921f-534ad8e6887e');

        // Assert - did we get the expected response
        expect(factSheet).toStrictEqual(new FactSheet(expectedFactSheet));
        return;
      });
    });

    // test('product does not exist', async () => {
    //   // set up Pact interactions

    //   mockProvider
    //     .given('a product with ID 11 does not exist')
    //     .uponReceiving('a request to get a product')
    //     .withRequest({
    //       method: 'GET',
    //       path: '/product/11',
    //       headers: {
    //         Authorization: like('Bearer 2019-01-14T11:34:18.045Z')
    //       }
    //     })
    //     .willRespondWith({
    //       status: 404
    //     });
    //   return mockProvider.executeTest(async (mockserver) => {
    //     const api = new API(mockserver.url);

    //     // make request to Pact mock server
    //     await expect(api.getProduct('11')).rejects.toThrow(
    //       'Request failed with status code 404'
    //     );
    //     return;
    //   });
    // });
  });
  // describe('retrieving products', () => {
  //   test('products exists', async () => {
  //     // set up Pact interactions
  //     const expectedProduct = {
  //       id: '10',
  //       type: 'CREDIT_CARD',
  //       name: '28 Degrees'
  //     };

  //     mockProvider
  //       .given('products exist')
  //       .uponReceiving('a request to get all products')
  //       .withRequest({
  //         method: 'GET',
  //         path: '/products',
  //         headers: {
  //           Authorization: like('Bearer 2019-01-14T11:34:18.045Z')
  //         }
  //       })
  //       .willRespondWith({
  //         status: 200,
  //         headers: {
  //           'Content-Type': 'application/json; charset=utf-8'
  //         },
  //         body: eachLike(expectedProduct)
  //       });
  //     return mockProvider.executeTest(async (mockserver) => {
  //       const api = new API(mockserver.url);

  //       // make request to Pact mock server
  //       const products = await api.getAllProducts();

  //       // assert that we got the expected response
  //       expect(products).toStrictEqual([new Product(expectedProduct)]);
  //       return;
  //     });
  //   });
  // });
});
