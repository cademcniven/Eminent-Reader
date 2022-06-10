const axios = require('axios')
const cheerio = require('cheerio')

const fileLogic = require('./fileLogic')

exports.DownloadNovel = async url => {
  if (!url) {
    console.log('No url provided')
    return
  }

  console.log(`Attempting to download novel from ${url}`)

  const hostname = GetHostname(url)
  if (scrapers.has(hostname)) {
    await scrapers.get(hostname)(cheerio.load(await AxiosGetHtml(url)), url)
  } else {
    console.log('Provided url is from an unsupported host')
  }
}

const Sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const GetHostname = url => new URL(url).hostname
const axiosHeaders = { headers: { 'User-Agent': 'Mozilla/5.0' } }

const AxiosGetHtml = async url => {
  try {
    return (await axios.get(url, axiosHeaders)).data
  } catch (error) {
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
}

const scrapers = new Map()
scrapers.set('ncode.syosetu.com', async ($, url) => {
  const baseUrl = 'https://' + GetHostname(url)

  const novelMetadata = {
    title: $('.novel_title').text(),
    description: $('#novel_ex').text(),
    author: $('.novel_writername a').text(),
    chapters: $('.index_box a').length,
    characters: 0,
    url,
    key: url.split('/')[3], // ncode
    last_updated: Date.now()
  }
  await fileLogic.UpdateNovel(novelMetadata)

  // get a list of all the chapters we need to download
  const chapterUrls = []
  $('.index_box a').each((i, link) => {
    const fullUrl = baseUrl + link.attribs.href
    chapterUrls.push(fullUrl)
  })

  // download the chapters and save partial metadata
  const chapterMetadata = []
  let chapterData
  for (let i = 0; i < chapterUrls.length; ++i) {
    chapterData = await AxiosGetHtml(chapterUrls[i])
    $ = cheerio.load(chapterData)

    chapterData = {
      title: $('.novel_subtitle').text(),
      // the regex removes all <br> elements and <p> elements that contain only whitespace
      chapter: $('#novel_honbun').html().replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ').replace(/<p.*> *<\/p>/g, ' '),
      chapter_number: i + 1
    }

    chapterData.characters = GetChapterCharacterCount(chapterData.chapter)

    await fileLogic.DownloadChapter(chapterData, i + 1, novelMetadata)
    chapterMetadata.push({
      title: chapterData.title,
      chapter_number: i + 1,
      characters: chapterData.characters,
      cumulative_characters: chapterData.characters + ((i === 0) ? 0 : chapterMetadata[i - 1].cumulative_characters)
    })

    await Sleep(2000) // so we don't get blocked from connecting too many times
  }

  novelMetadata.chapter_data = chapterMetadata
  novelMetadata.characters = chapterMetadata[chapterMetadata.length - 1].cumulative_characters
  return fileLogic.UpdateMetadata(novelMetadata)
})

const GetChapterCharacterCount = text => {
  return text.replace(/[「」『』（）〔〕［］｛｝｟｠〈〉《》【】〖〗〘〙〚〛。、・…゠＝〜…‥•◦﹅﹆※＊〽〓♪♫♬♩]/g, '').length
}

scrapers.set('kakuyomu.jp', async ($, url) => {
  const baseUrl = 'https://' + GetHostname(url)

  const novelMetadata = {
    title: $('#workTitle').text(),
    description: $('#introduction').text(),
    author: $('#workAuthor-activityName').text(),
    chapters: $('.widget-toc-episode').length,
    characters: 0,
    url,
    key: url.split('/')[4], // ncode
    last_updated: Date.now()
  }

  await fileLogic.UpdateNovel(novelMetadata)

  // get a list of all the chapters we need to download
  const chapterUrls = $('a.widget-toc-episode-episodeTitle').map((i, link) => baseUrl + link.attribs.href).toArray()

  // download the chapters and save partial metadata
  const chapterMetadata = []
  let chapterData
  for (let i = 0; i < chapterUrls.length; ++i) {
    $ = cheerio.load(await AxiosGetHtml(chapterUrls[i]))

    chapterData = {
      title: $('.widget-episodeTitle').text(),
      // the regex removes all <br> elements and <p> elements that contain only whitespace
      chapter: $('.widget-episodeBody').html().replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ').replace(/<p.*> *<\/p>/g, ' '),
      chapter_number: i + 1
    }

    chapterData.characters = GetChapterCharacterCount(chapterData.chapter)

    await fileLogic.DownloadChapter(chapterData, i + 1, novelMetadata)
    chapterMetadata.push({
      title: chapterData.title,
      chapter_number: i + 1,
      characters: chapterData.characters,
      cumulative_characters: chapterData.characters + ((i === 0) ? 0 : chapterMetadata[i - 1].cumulative_characters)
    })
    await Sleep(2000) // so we don't get blocked from connecting too many times
  }

  novelMetadata.chapter_data = chapterMetadata
  novelMetadata.characters = chapterMetadata[chapterMetadata.length - 1].cumulative_characters
  return fileLogic.UpdateMetadata(novelMetadata)
})
