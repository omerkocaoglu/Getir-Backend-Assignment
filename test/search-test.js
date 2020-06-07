const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');

chai.use(chaiHttp);

describe('/POST search', () => {
    it('Response 200', (done) => {
        const searchData = {
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 2700,
            "maxCount": 3000
        };
        chai.request(server)
            .post('/api/records')
            .send(searchData)
            .end((err, res) => {
                res.should.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('code', 0);
                res.body.should.have.property('msg', 'Success');
                res.body.should.have.property('records');
                done();
            });
    });
});

describe('/POST search', () => {
    it('Response 400 (Bad request for startDate and/or endDate)', (done) => {
        const searchData = {
            "startDate1": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 2700,
            "maxCount": 3000
        };
        chai.request(server)
            .post('/api/records')
            .send(searchData)
            .end((err, res) => {
                res.should.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('code', 400);
                res.body.should.have.property('msg', 'start date and/or end date cannot be undefined.');
                res.body.should.have.property('records');
                done();
            });
    });
});

describe('/POST search', () => {
    it('Response 422 (Unprocessable entity for startDate and endDate invalid format)', (done) => {
        const searchData = {
            "startDate": "asd",
            "endDate": "2018-02-02",
            "minCount": 2700,
            "maxCount": 3000
        };
        chai.request(server)
            .post('/api/records')
            .send(searchData)
            .end((err, res) => {
                res.should.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('code', 422);
                res.body.should.have.property('msg', 'Invalid format for start date and/or end date.');
                res.body.should.have.property('records');
                done();
            });
    });
});

describe('/POST search', () => {
    it('Response 422 (Unprocessable entity for counts invalid format)', (done) => {
        const searchData = {
            "startDate": "2016-07-22",
            "endDate": "2016-07-23",
            "minCount": "a.dew",
            "maxCount": 3000
        };
        chai.request(server)
            .post('/api/records')
            .send(searchData)
            .end((err, res) => {
                res.should.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('code', 422);
                res.body.should.have.property('msg', 'Invalid format for counts.');
                res.body.should.have.property('records');
                done();
            });
    });
});