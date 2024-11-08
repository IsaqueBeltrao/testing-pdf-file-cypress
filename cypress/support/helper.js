const pdf = require('pdf-parse')
const path = require('path')
const fs = require('fs')

const readPdf = (pathToPdf) => {
    return new Promise((resolve) => {
        const pdfPath = path.resolve(pathToPdf)
        const pdfData = fs.readFileSync(pdfPath)
        pdf(pdfData)
            .then(function ({ text }) {
                resolve(text)
            })
    })
}

module.exports = { readPdf }