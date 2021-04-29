/*
 *  bin/generate-ca.js
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

_.promise()
    .then(fs.read.yaml.p(path.join(__dirname, "raw", "ca.yaml")))
    .make(sd => {
        console.log(sd.json[0])
    })
    .catch(error => {
        console.log("#", _.error.message(error))
    })

