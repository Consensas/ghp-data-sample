const cborld = require("@digitalbazaar/cborld")
const qrcode = require("qrcode")
const base32 = require("hi-base32")
const _ = require("lodash")

const document_vc = require("./vcbbs-small.json")

const url_context_bbs_v1 = "https://w3id.org/security/bbs/v1"
const document_context_bbs_v1 = require("./context_bbs_v1.json")

const url_context_credentials_v1 = "https://www.w3.org/2018/credentials/v1"
const document_context_credentials_v1 = require("./context_credentials_v1.json")

const url_context_pathogen_v1 = "https://w3id.org/pathogen/v1"
const document_context_pathogen_v1 = require("./context_pathogen_v1.json")

const loader = url => {
    switch (url) {
    case url_context_bbs_v1:
        console.log("- loader:", url_context_bbs_v1)
        return {
            contextUrl: null,
            document: document_context_bbs_v1,
            documentUrl: url_context_bbs_v1,
        }

    case url_context_credentials_v1:
        console.log("- loader:", url_context_credentials_v1)
        return {
            contextUrl: null,
            document: document_context_credentials_v1,
            documentUrl: url_context_credentials_v1,
        }

    case url_context_pathogen_v1:
        console.log("- loader:", url_context_pathogen_v1)
        return {
            contextUrl: null,
            document: document_context_pathogen_v1,
            documentUrl: url_context_pathogen_v1,
        }

    default:
        return null
    }
}

const qencode_size = async data => {
    try {
        if (_.isBuffer(data)) {
            data = [
                {
                    data: new Uint8ClampedArray(data, 0, 4),
                    mode: "byte",
                },
            ]
        }

        const result = await qrcode.toString(data, {
                errorCorrectionLevel: "Q",
            })
        const rows = result.split("\n").length
        
        return Math.ceil(rows * rows / 8)
    } catch (x) {
        return "--fail--: " + x
    }
}

const main = async () => {
    const bytes = await cborld.encode({
        jsonldDocument: document_vc,
        documentLoader: loader,
    });
    console.log("cborld", bytes.length)

    const bytes_32 = base32.encode(bytes)
    console.log("cborld-base32", bytes_32.length)

    const bytes_32_qr = await qencode_size(bytes_32)
    console.log("cborld-base32-qr", bytes_32_qr)
}

main()
    .then(() => console.log("done"))
    .catch(error => console.log("error", error))
