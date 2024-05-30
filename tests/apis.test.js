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
            "city": /.*/,
            "region": /.*/,
            "country": /.*/,
            "loc": /.*/,
            "org": /.*/,
            "postal": /.*/,
            "timezone": /.*/,
            "readme": "https://ipinfo.io/missingauth"
        });
    }).catch(err => {
        console.error(err.message);
    });
});

test('test get main new', () => {
    return Apis.getMainNew().then(response => {
        if(!response.data) {
            console.error("Empty response from main new");
            return null;
        } else if(!response.data.articles) {
            console.error("Unexpected response from main new");
            return null;
        } else if(!Array.isArray(response.data.articles)) {
            console.error("Unexpected response from main new. Expect array");
            return null;
        } else if(response.data.articles.length < 1) {
            console.error("Empty news array from main new");
            return null;
        }
        expect.assertions(1);
        expect(response.data.articles[0]).toMatchObject({
            "_id": /.*/,
            "title": /.*/,
            "link": /^http.*/,
            "summary": /.*/,
            "media": /^http.*/,
            "published_date": /.*/
        });
    }).catch(err => {
        console.error(err.message);
    })
});

test('test get news', () => {
    return Apis.getNews().then(response => {
        expect(response.data.results[0]).not.toBeNull();
    }).catch(err => {
        console.error(err.message);
    })
});

test('test get weather', () => {
    return Apis.getWeather({
        "loc": "45.1313,42.1212"
    }).then(response => {
        expect(response.data).not.toBeNull();
    })
});

test('test get exchange rate', () => {
    return Apis.getExchangeRateCache().then(response => {
        expect(response.data).not.toBeNull();
    }).catch(err => {
        console.error(err.message);
    })
});