const base32 = require("hi-base32")
const _ = require("lodash")
const _util = require("./_util")

const document_vc = require("./vcbbs-small.json")

const main = async () => {
    console.log("+ ZLIB")
    const size = JSON.stringify(document_vc).length
    console.log("json", size)

    const bytes = await _util.zdeflate(JSON.stringify(document_vc))

    const bytes_32 = base32.encode(bytes).replace(/=*$/, "")
    console.log("zlib-base32", bytes_32.length, _util.show(bytes_32.length, size))

    // const url = "DATA:APPLICATION/JSON;BASE32:" + bytes_32
    const url = "JZ32:" + bytes_32

    const url_qr = await _util.qencode_size(url, "zlib-base32-qr.png")
    console.log("zlib-base32-qr", url_qr, _util.show(url_qr, size))

    console.log()
    console.log(url.match(/.{1,64}/g).join("\n"))
    console.log()
}

main()
    .then(() => console.log())
    .catch(error => console.log("error", error))
