import Apis from '../src/apis';
jest.mock('../mocks/apis');

test('test ip api', () => {
    expect.assertions(1);
    return Apis.getIPaddress().then(response => {
        expect(response.data).toMatchObject({
            "ip": /[\d]+\.[\d]+\.[\d]+\.[\d]+/
        });
    }).catch(error => {
        console.error(error.message);
    });
});

test('test get location api', () => {
    expect.assertions(1);
    return Apis.getGeoLocation("45.45.45.45").then(response => {
        expect(response.data).toMatchObject({
            "ip": /[\d]+\.[\d]+\.[\d]+\.[\d]+/,
            "city": /.+/,
            "region": /.+/,
            "country": /.+/,
            "loc": /.+/,
            "org": /.+/,
            "postal": /.+/,
            "timezone": /.+/,
            "readme": "https://ipinfo.io/missingauth"
        });
    });
})