const axios = require('axios')
const cheerio = require('cheerio')

const GetHostname = (url) => {
    return new URL(url).hostname
}

exports.DownloadNovel = function (url) {
    if (!url) {
        console.log("No url provided")
        return
    }

    console.log(`Attempting to download novel from ${url}`)

    let hostname = GetHostname(url)
    console.log(hostname)

    switch (hostname) {
        case "ncode.syosetu.com":
            ScrapeNovel(url, ScrapeSyosetu)
            break
        case "kakuyomu.jp":
            ScrapeNovel(url, ScrapeKakuyomi)
            break
        default:
            console.log("Provided url is from an unsupported host")
    }
}

function ScrapeNovel(url, callback) {
    axios.get(url, GetAxiosHeaders()).then(({ data }) => {
        callback(data)
    }).catch(function (error) {
        HandleAxiosError(error)
    })
}

function GetAxiosHeaders() {
    return { headers: { 'User-Agent': 'Mozilla/5.0' } }
}

function HandleAxiosError(error) {
    console.log(`The following error occured while trying to connect to ${url}:`)
    if (error.response) {
        // Request made and server responded
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
    }
}

function ScrapeSyosetu(data) {
    const $ = cheerio.load(data)

    let novelMetadata = GetSyosetuNovelMetadata(data)

    console.log(novelMetadata)
}

function GetSyosetuNovelMetadata(data) {
    const $ = cheerio.load(data)

    return {
        "title": $(".novel_title").text(),
        "description": $("#novel_ex").html(),
        "author": $(".novel_writername a").text(),
        "chapters": $(".index_box a").length
    }
}

function ScrapeKakuyomi(url) {

}