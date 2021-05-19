/*
 *  jsonxt.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-04-14
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

const jsonxt = require("jsonxt")

const base32 = require("hi-base32")
const _ = require("lodash")
const _util = require("./_util")
const fs = require("iotdb-fs")

const document_vc = require("./vcbbs-small.json")

const main = async () => {
    console.log("+ JSON-XT")
    const size = JSON.stringify(document_vc).length
    console.log("json", size)

    const templates = JSON.parse(await fs.promises.readFile("./templates.json", "utf-8"))
    const type = "ghpt"
    const version = "1"
    const resolver = "goodhealthpass.org"

    const url = await jsonxt.pack(document_vc, templates, type, version, resolver, {
        uppercase: true,
    })

    const url_qr = await _util.qencode_size(url, "jsonxt-qr.png")
    console.log("jsonxt-qr", url_qr, _util.show(url_qr, size))

    console.log()
    console.log(url.match(/.{1,64}/g).join("\n"))
    console.log()
}

main()
    .then(() => console.log())
    .catch(error => console.log("error", error))

/**
const _one = _.promise((self, done) => {
    _.promise(self)
        .validate(_one)

        .then(fs.read.json.magic)
        .make(async sd => {
            console.log("file", sd.path)
                
            const jencoded = JSON.stringify(sd.json)

                try {
                    const packed = await jsonxt.pack(sd.json, sd.templates, ad.type, ad.version, ad.resolver, {
                        uppercase: true,
                    })
                    console.log(packed)
                } 
                catch (x) {
                    console.log(x)
                }
        })

        .end(done, self, _one)
 */
