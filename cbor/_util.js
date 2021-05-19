const _ = require("lodash")
const qrcode = require("qrcode")

exports.qencode_size = async (data, filename) => {
    try {
        if (_.isBuffer(data)) {
            data = [
                {
                    data: new Uint8ClampedArray(data, 0, 4),
                    mode: "byte",
                },
            ]
        }

        if (filename) {
            await qrcode.toFile(filename, data, {
                errorCorrectionLevel: "Q",
            })
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

exports.show = (v, size) => {
    if (!_.isNumber(v)) {
        return v
    }
    const p = Math.round(v * 1000 / size) / 10
    return `${v} ${p}%`
}
