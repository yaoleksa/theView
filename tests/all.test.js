import Apis from '../src/apis';
jest.mock('../mocks/apis');

it('test apis', () => {
    expect.assertions(1);
    return Apis.getIPaddress().then(response => {
        expect(response.data).toMatchObject({
            "ip": /[\d]+\.[\d]+\.[\d]+\.[\d]+/
        });
    });
});