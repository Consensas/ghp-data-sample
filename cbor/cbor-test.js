const cborld = require("@digitalbazaar/cborld")
const base32 = require("hi-base32")
const _ = require("lodash")
const _util = require("./_util")

const document_vc = require("./vcbbs-small.json")

const loader = url => {
    const url_context_bbs_v1 = "https://w3id.org/security/bbs/v1"
    const document_context_bbs_v1 = require("./context_bbs_v1.json")

    const url_context_credentials_v1 = "https://www.w3.org/2018/credentials/v1"
    const document_context_credentials_v1 = require("./context_credentials_v1.json")

    const url_context_pathogen_v1 = "https://w3id.org/pathogen/v1"
    const document_context_pathogen_v1 = require("./context_pathogen_v1.json")

    switch (url) {
    case url_context_bbs_v1:
        // console.log("- loader:", url_context_bbs_v1)
        return {
            contextUrl: null,
            document: document_context_bbs_v1,
            documentUrl: url_context_bbs_v1,
        }

    case url_context_credentials_v1:
        // console.log("- loader:", url_context_credentials_v1)
        return {
            contextUrl: null,
            document: document_context_credentials_v1,
            documentUrl: url_context_credentials_v1,
        }

    case url_context_pathogen_v1:
        // console.log("- loader:", url_context_pathogen_v1)
        return {
            contextUrl: null,
            document: document_context_pathogen_v1,
            documentUrl: url_context_pathogen_v1,
        }

    default:
        return null
    }
}

const main = async () => {
    console.log("+ CBOR-LD")
    const size = JSON.stringify(document_vc).length
    console.log("json", size)

    let bytes = await cborld.encode({
        jsonldDocument: document_vc,
        documentLoader: loader,
    });
    console.log("cborld", bytes.length)

    let bytes_32 = base32.encode(bytes).replace(/=*$/, "")
    console.log("cborld-base32", bytes_32.length, _util.show(bytes_32.length, size))

    let url = "CBLD:" + bytes_32

    let url_qr = await _util.qencode_size(url, "cborld-base32-qr.png")
    console.log("cborld-base32-qr", url_qr, _util.show(url_qr, size))

    console.log()
    console.log(url.match(/.{1,64}/g).join("\n"))
    console.log()

    /**
     */
    {
        bytes = await _util.zdeflate(bytes)

        const bytes_32 = base32.encode(bytes).replace(/=*$/, "")
        console.log("cborld-zlib-base32-qr", bytes_32.length, _util.show(bytes_32.length, size))

        // const url = "DATA:APPLICATION/JSON;BASE32:" + bytes_32
        const url = "CBLDZ:" + bytes_32

        const url_qr = await _util.qencode_size(url, "cborld-zlib-base32-qr.png")
        console.log("cborld-zlib-base32-qr", url_qr, _util.show(url_qr, size))

        console.log()
        console.log(url.match(/.{1,64}/g).join("\n"))
        console.log()
    }
}

main()
    .then(() => console.log())
    .catch(error => console.log("error", error))
