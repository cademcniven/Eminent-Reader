const axios = require('axios')
const cheerio = require('cheerio')

const fileLogic = require('./fileLogic')

exports.DownloadNovel = function (url) {
    if (!url) {
        console.log("No url provided")
        return
    }

    console.log(`Attempting to download novel from ${url}`)

    let hostname = GetHostname(url)
    switch (hostname) {
        case "ncode.syosetu.com":
            AxiosGetHtml(url).then(data => ScrapeSyosetu(data, url))
            break
        case "kakuyomu.jp":
            AxiosGetHtml(url).then(data => ScrapeKakuyomu(data, url))
            break
        default:
            console.log("Provided url is from an unsupported host")
    }
}

const Sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const GetHostname = (url) => {
    return new URL(url).hostname
}

const AxiosGetHtml = async url => {
    const { data } = await axios.get(url, GetAxiosHeaders()).catch(function (error) {
        HandleAxiosError(error, url)
    })

    return data
}

const GetAxiosHeaders = () => {
    return { headers: { 'User-Agent': 'Mozilla/5.0' } }
}

const HandleAxiosError = (error, url) => {
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

const ScrapeSyosetu = async (data, url) => {
    const $ = cheerio.load(data)
    const baseUrl = "https://" + GetHostname(url)

    let novelMetadata = GetSyosetuNovelMetadata(data, url)
    fileLogic.UpdateNovel(novelMetadata)

    //get a list of all the chapters we need to download
    let chapterUrls = []
    $(".index_box a").each((i, link) => {
        let fullUrl = baseUrl + link.attribs.href
        chapterUrls.push(fullUrl)
    })

    //download the chapters and save partial metadata
    let chapterMetadata = []
    for (let i = 0; i < chapterUrls.length; ++i) {
        AxiosGetHtml(chapterUrls[i]).then(data => {
            chapterMetadata.push(DownloadSyosetuChapter(data, i, novelMetadata))
        })
        await Sleep(2000) //so we don't get blocked from connecting too many times
    }

    //add cumulative character count to metadata
    for (let i = 0; i < chapterUrls.length; ++i) {
        if (i === 0)
            chapterMetadata[i].cumulative_characters = chapterMetadata[i].characters
        else
            chapterMetadata[i].cumulative_characters = chapterMetadata[i].characters + chapterMetadata[i - 1].cumulative_characters
    }

    novelMetadata.chapter_data = chapterMetadata
    novelMetadata.characters = GetNovelCharacterCount(chapterMetadata)
    fileLogic.UpdateMetadata(novelMetadata)
}

const GetSyosetuNovelMetadata = (data, url) => {
    const $ = cheerio.load(data)

    return {
        "title": $(".novel_title").text(),
        "description": $("#novel_ex").text(),
        "author": $(".novel_writername a").text(),
        "chapters": $(".index_box a").length,
        "characters": 0,
        "url": url,
        "key": url.split('/')[3], //ncode
        "last_updated": Date.now()
    }
}

const DownloadSyosetuChapter = (data, index, metaData) => {
    const $ = cheerio.load(data)

    let chapterData = {
        "title": $(".novel_subtitle").text(),
        //the regex removes all <br> elements and <p> elements that contain only whitespace
        "chapter": $("#novel_honbun").html().replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ').replace(/<p.*> *<\/p>/g, ' '),
        "chapter_number": index + 1
    }

    chapterData.characters = GetChapterCharacterCount(chapterData.chapter)

    fileLogic.DownloadChapter(chapterData, index + 1, metaData)

    return { "title": chapterData.title, "chapter_number": index + 1, "characters": chapterData.characters }
}

const punctuation = /[「」『』（）〔〕［］｛｝｟｠〈〉《》【】〖〗〘〙〚〛。、・…゠＝〜…‥•◦﹅﹆※＊〽〓♪♫♬♩]/g

const GetChapterCharacterCount = (text) => {
    return text.replace(punctuation, '').length
}

const GetNovelCharacterCount = (chapterMetadata) => {
    let characters = 0

    for (let chapter of chapterMetadata) {
        characters += chapter.characters
    }

    return characters
}

function ScrapeKakuyomu(url) {

}