import {my_api} from '../pages/api/my_api';
import { Matchers } from '@pact-foundation/pact';
import { pactWith } from 'jest-pact';

pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
    let client: { getHealth: any; };

    beforeEach(() => {
        client = my_api(provider.mockService.baseUrl)
      });

    describe('My API test', () => {

        // Here we set up the interaction that the Pact
        // mock provider will expect.
        //
        // jest-pact takes care of validating and tearing
        // down the provider for you.
        beforeEach(() => // note the implicit return.
            // addInteraction returns a promise.
            // If you don't want to implict return,
            // you will need to `await` the result
            provider.addInteraction({
                state: "Server is healthy",
                uponReceiving: 'A request for API health',
                willRespondWith: {
                status: 200,
                body: {
                    status: Matchers.like('up'),
                },
                },
                withRequest: {
                    method: 'GET',
                    path: '/health',
                },
            })
        );

        it('Testing the GET call', () => {
            client.getHealth().then((health: any) => {
                expect(health).toEqual('up');
                console.log(`health: response: ${health}`);
            });
        });
        
    });

});