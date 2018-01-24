/*
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */
'use strict';

var swaggerEndpoint = require('../../../common/swaggerSpec');
var apiHelpers = require('../../../common/helpers/api');
var expectSwaggerParamError = apiHelpers.expectSwaggerParamError;

describe('GET /node', function () {

	describe('/constants', function () {

		var endPoint = swaggerEndpoint('GET /node/constants 200');

		var constantsResponse;

		before(function () {
			return endPoint.makeRequest()
				.then(function (response) {
					constantsResponse = response.body.data;
				});
		});

		it('should return a result containing nethash = "198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d"', function () {
			expect(constantsResponse.nethash).to.be.equal('198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d');
		});


		it('should return a result containing milestone that is a number <= 500000000', function () {
			expect(parseInt(constantsResponse.milestone)).to.at.most(500000000);
		});

		it('should return a result containing reward that is a number <= 500000000', function () {
			expect(parseInt(constantsResponse.reward)).to.at.most(500000000);
		});

		it('should return a result containing supply that is a number = 10000000000000000', function () {
			expect(constantsResponse.supply).to.be.equal('10000000000000000');
		});

		it('should return a result containing version = "0.0.1"', function () {
			expect(constantsResponse).to.have.property('version').equal('0.0.1');
		});

		it('should return a result containing fees.send = 10000000', function () {
			expect(constantsResponse.fees.send).to.be.equal('10000000');
		});

		it('should return a result containing fees.vote = 100000000', function () {
			expect(constantsResponse.fees.vote).to.be.equal('100000000');
		});

		it('should return a result containing fees.secondSignature = 500000000', function () {
			expect(constantsResponse.fees.secondSignature).to.be.equal('500000000');
		});

		it('should return a result containing fees.delegate = 2500000000', function () {
			expect(constantsResponse.fees.delegate).to.be.equal('2500000000');
		});

		it('should return a result containing fees.multisignature = 500000000', function () {
			expect(constantsResponse.fees.multisignature).to.be.equal('500000000');
		});

		it('should return a result containing fees.dappRegistration = 2500000000', function () {
			expect(constantsResponse.fees.dappRegistration).to.be.equal('2500000000');
		});

		it('should return a result containing fees.dappWithdrawal = 10000000', function () {
			expect(constantsResponse.fees.dappWithdrawal).to.be.equal('10000000');
		});

		it('should return a result containing fees.dappDeposit = 10000000', function () {
			expect(constantsResponse.fees.dappDeposit).to.be.equal('10000000');
		});

		it('should return a result containing fees.data = 10000000', function () {
			expect(constantsResponse.fees.data).to.be.equal('10000000');
		});
	});

	describe('/status', function () {

		var ndoeStatusEndpoint = swaggerEndpoint('GET /node/status 200');

		it('should return node status', function () {
			return ndoeStatusEndpoint.makeRequest();
		});

		describe('GET /forging', function () {

			var forgingEndpoint = new swaggerEndpoint('GET /node/status/forging');

			// TODO: Find a library for supertest to make request from a proxy server
			it('called from unauthorized IP should fail');

			it('using no params should return full list of internal forgers', function () {
				return forgingEndpoint.makeRequest({}, 200).then(function (res) {
					expect(res.body.data.length).to.be.eql(__testContext.config.forging.secret.length);
				});
			});

			it('using invalid publicKey should fail', function () {
				return forgingEndpoint.makeRequest({publicKey: 'invalidPublicKey'}, 400).then(function (res) {
					expectSwaggerParamError(res, 'publicKey');
				});
			});

			it('using empty publicKey should should fail', function () {
				return forgingEndpoint.makeRequest({publicKey: 'invalidPublicKey'}, 400).then(function (res) {
					expectSwaggerParamError(res, 'publicKey');
				});
			});

			it('using existing publicKey should be ok', function () {
				var publicKey = __testContext.config.forging.secret[0].publicKey;

				return forgingEndpoint.makeRequest({publicKey: publicKey}, 200).then(function (res) {
					expect(res.body.data).to.have.length(1);
					expect(res.body.data[0].publicKey).to.be.eql(publicKey);
				});
			});

			it('using enabled publicKey should be ok', function () {
				var publicKey = __testContext.config.forging.secret[0].publicKey;

				return forgingEndpoint.makeRequest({publicKey: publicKey}, 200).then(function (res) {
					expect(res.body.data[0].publicKey).to.be.eql(publicKey);
					expect(res.body.data[0].forging).to.be.true;
				});
			});
		});
	});
});