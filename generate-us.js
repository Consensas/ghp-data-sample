/*
 *  bin/generate-us.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-04-29
 *
 *  Copyright (2013-2021) Consensas
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const path = require("path")

const isodate = date => date.toISOString().replace(/[.]\d\d\dZ$/, "Z")

const vaccines = [
    {
        "cvx": "207",
        "name": "Moderna COVID-19 Vaccine",
        "mvx": "MOD",
        "cpt": "91301",
        "weeks": 8,
    },
    {
        "cvx": "208",
        "name": "Pfizer COVID-19 Vaccine",
        "mvx": "PFR",
        "cpt": "91300",
        "weeks": 8,
    },
    {
        "cvx": "210",
        "name": "AstraZeneca COVID-19 Vaccine",
        "mvx": "ASZ",
        "cpt": "91302",
        "weeks": 16,
    },
    {
        "cvx": "212",
        "name": "Janssen COVID-19 Vaccine",
        "mvx": "JSN",
        "cpt": "91303",
        "weeks": 12,
    },
]


/**
 */
const sign = _.promise((self, done) => {
    _.promise(self)
        .validate(sign)
        .make(sd => {
            sd.record = {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://GOODHEALTHPASS.COM/vaccination/v1",
                "https://w3id.org/security/bbs/v1"
              ],
              "id": `https://issuer.oidp.uscis.gov/credentials/${ sd.raw.code }`,
              "type": [
                "VerifiableCredential",
                "VaccinationCredential"
              ],
              "issuer": "did:example:489398593",
              "issuanceDate": sd.now,
              "expirationDate": isodate(new Date(new Date().getTime() + 1000 * 3600 * 24 * 7)),
              "credentialSubject": self.record,
              "proof": {
                "type": "BbsBlsSignature2020",
                "created": sd.now,
                "proofPurpose": "assertionMethod",
                "proofValue": "peTzDkGg4f37LYp2JcujydmgAFyNuWdijjVf7JxwCQZmVCM6FKsMcOWaqax6HGzYMWWorVBEVJ6OfZLzbC7TJgS7Gbxc03BdRGlbdfm+r+VjpSwBV2hAP7xrzDM6R619BDTQatsXPrTz" + _.random.id(16),
                "verificationMethod": "did:example:489398593#test"
              }
            }
        })

        .end(done, self, sign)
})

sign.method = "sign"
sign.description = ``
sign.requires = {
    record: _.is.Dictionary,
    raw: _.is.Dictionary,
}
sign.accepts = {
}
sign.produces = {
    record: _.is.Dictionary,
}


/**
 */
const make_covid_flat = _.promise((self, done) => {
    _.promise(self)
        .validate(make_covid_flat)

        .make(sd => {
            const vd = _.random.choose(vaccines)
            
            const sequence = _.random.integer(2) + 1
            const next = new Date(new Date(_.d.first(sd.record, "treated")).getTime() + vd.weeks * 7 * 24 * 60 * 60 * 1000)

            sd.record = {
                "recipient": _.d.first(sd.record, "code", null),
                "birthDate": _.d.first(sd.record, "birthDate", null),
                "gender": _.d.first(sd.record, "gender", null),
                "givenName": _.d.first(sd.record, "givenName", null),
                "middleName": _.d.first(sd.record, "additionalName", null),
                "familyName": _.d.first(sd.record, "familyName", null),
                "dateOfVaccination": _.d.first(sd.record, "treated", null),
                "administeringCentre": [
                    _.d.first(sd.record, "hospital.name"),
                    _.d.first(sd.record, "hospital.locality"),
                    // _.d.first(sd.record, "hospital.region"),
                    // _.d.first(sd.record, "hospital.country"),
                ].filter(s => !_.is.Empty(s)).join(", "),
                "healthProfessional": _.random.id(8),
                "countryOfVaccination": _.d.first(sd.record, "hospital.country", null),
                "stateOfVaccination": _.d.first(sd.record, "hospital.region", null),
                "batchNumber": _.random.id(8),
                "cycleNumber": `${sequence}`,
                "nextVaccinationDate": sequence === 1 ? next.toISOString().substring(0, 10) : null,
                "vaccineEvent": _.random.id(8),
                "linkedVaccineEvent": sequence === 2 ? _.random.id(8) : null,
                "medicinalProductName": vd.name,
                "_marketingAuthorizationHolder": "???",
                "cvxCode": vd.cvx,
            }
        })

        .end(done, self, make_covid_flat)
})

make_covid_flat.method = "make_covid_flat"
make_covid_flat.requires = {
    record: _.is.Dictionary,
}
make_covid_flat.produces = {
    record: _.is.Dictionary,
}

/**
 */
const _one = _.promise((self, done) => {
    _.promise(self)
        .validate(_one)

        .make(sd => {
            sd.now = isodate(new Date())
            sd.record = sd.raw
        })

        .then(make_covid_flat)
        .then(sign)

        .make(sd => {
            sd.json = sd.record
            sd.path = path.join(__dirname, "cooked/us/" + sd.raw.code + ".json")
        })
        .then(fs.make.directory.parent)
        .then(fs.write.json.pretty)
        .log("wrote", "path")

        .end(done, self, _one)
})

_one.method = "_one"
_one.description = ``
_one.requires = {
    raw: _.is.Dictionary,
}
_one.produces = {
    record: _.is.Dictionary,
}


/**
 */
_.promise()
    .then(fs.read.yaml.p(path.join(__dirname, "raw", "us.yaml")))
    .make(sd => {
        sd.raws = sd.json.slice(0, 25)
    })
    .each({
        method: _one,
        inputs: "raws:raw",
        outputs: "records",
        output_selector: sd => sd.record,
    })
    .catch(error => {
        console.log("#", _.error.message(error))
    })

