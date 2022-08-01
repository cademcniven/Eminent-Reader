const axios = require('axios')
const cheerio = require('cheerio')
const fileLogic = require('./fileLogic')
const AdmZip = require('adm-zip')
const xml = require('xml-parse')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const GetChapterCharacterCount = text => {
  text = text.replace(/[「」『』（）〔〕［］｛｝｟｠〈〉《》【】〖〗〘〙〚〛。、・…゠＝〜…‥•◦﹅﹆※＊〽〓♪♫♬♩]/g, '')
  return text.replace(/<[^>]+>/g, '').length
}

const Sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const GetHostname = url => new URL(url).hostname
const axiosHeaders = { headers: { 'User-Agent': 'Mozilla/5.0', cookie: 'over18=yes' } }
const GetUrlEnding = url => {
  url = url.split('/')
  return url.pop() || url.pop()
}

const scrapers = new Map()

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

scrapers.set('ncode.syosetu.com', async ($, url) => DownloadSyosetuNovel($, url))
scrapers.set('novel18.syosetu.com', async ($, url) => DownloadSyosetuNovel($, url))
scrapers.set('kakuyomu.jp', async ($, url) => DownloadKakuyomuNovel($, url))

const DownloadSyosetuNovel = async ($, url) => {
  const baseUrl = 'https://' + GetHostname(url)
  const key = GetUrlEnding(url)

  const novelMetadata = {
    title: $('.novel_title').text(),
    description: $('#novel_ex').text(),
    author: $('.novel_writername a').text(),
    chapters: $('.index_box a').length,
    characters: 0,
    url,
    key: key, // ncode
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
}

const DownloadKakuyomuNovel = async ($, url) => {
  const baseUrl = 'https://' + GetHostname(url)
  const key = GetUrlEnding(url)

  const novelMetadata = {
    title: $('#workTitle').text(),
    description: $('#introduction').text(),
    author: $('#workAuthor-activityName').text(),
    chapters: $('.widget-toc-episode').length,
    characters: 0,
    url,
    key: key,
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
}

exports.DownloadEpub = async (files) => {
  const entries = GetXmlEntries(files.file.data)
  const contentOpf = GetContentOpf(entries)
  const key = Date.now()

  //console.log(entries)

  let chapters = GetChapters(contentOpf, entries)
  let images = GetImages(contentOpf, entries)

  const novelMetadata = {
    title: 'test',
    description: '',
    author: '',
    chapters: chapters.length,
    characters: 0,
    url: '',
    key: key,
    last_updated: Date.now()
  }

  await fileLogic.UpdateNovel(novelMetadata)

  //save all images to novel folder
  for (let image of images) {
    let filename = image.filename.split('/').pop()
    await fileLogic.SaveImage(key, filename, image.entry.getData())
  }

  const chapterMetadata = []
  let chapterData = {}
  let i = 0
  for (let chapter of chapters) {
    let body = chapter.entry.getData().toString().match(/<body.*?>([\s\S]*)<\/body>/)[0]

    let dom = new JSDOM(body)
    let srcs = dom.window.document.querySelectorAll('img')
    for (let src of srcs)
      src.src = `/novels/${key}/${src.src.split('/').pop()}`

    body = dom.window.document.body.innerHTML

    chapterData = {
      title: chapter.title,
      // the regex removes all <br> elements and <p> elements that contain only whitespace
      chapter: body/*.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ').replace(/<p.*> *<\/p>/g, ' ')*/,
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

    i++
  }

  novelMetadata.chapter_data = chapterMetadata
  novelMetadata.characters = chapterMetadata[chapterMetadata.length - 1].cumulative_characters
  return fileLogic.UpdateMetadata(novelMetadata)
}

/*
  epub is a zip containing xml files, as well as resources
  linked to by those xml files (such as images).
  an epub has to contain a file called container.xml to be valid.
  the only purpose of container.xml is to provide the relative
  location of of the content.opf file
*/
const GetXmlEntries = (data) => {
  const zip = new AdmZip(data)
  const zipEntries = zip.getEntries()

  let entries = {}
  for (let entry of zipEntries) {
    entries[entry.name] = entry
  }

  if (!entries['container.xml'])
    throw ('epub file does not contain "container.xml"')

  return entries
}

/*
  the opf file contains metadata about an epub, and is
  the primary source of information about how to process it
*/
const GetContentOpf = (entries) => {
  if (entries['content.opf'])
    return entries['content.opf']

  const parsed = xml.parse(entries['container.xml'].getData().toString())
  const xmlDoc = new xml.DOM(parsed)

  let rootfiles = xmlDoc.document.getElementsByTagName('rootfile')

  for (let rootfile of rootfiles) {
    if (rootfile.attributes['media-type'] === 'application/oebps-package+xml')
      return entries[rootfile.attributes['full-path']]
  }

  throw ('Could not locate content.opf')
}

const GetChapters = (opf, entries) => {
  const parsed = xml.parse(opf.getData().toString())
  const xmlDoc = new xml.DOM(parsed)

  let chapters = []

  //ncx files are relics from epub2, but some epub3 files still have them for
  //compatibility. ncx files contain ToC info
  let ncx = xmlDoc.document.getElementsByAttribute('media-type', 'application/x-dtbncx+xml')
  //nav files are like ncx but for epub3
  let nav = xmlDoc.document.getElementsByAttribute('properties', 'nav')

  if (ncx.length) {
    ncx = entries[ncx[0].attributes['href']]
    chapters = GetNcxChapterInfo(ncx, entries)
  } else if (nav.length) {
    nav = entries[nav[0].attributes['href']]
    chapters = GetNavChapterInfo(nav, entries)
  }

  return chapters
}

const GetImages = (opf, entries) => {
  const parsed = xml.parse(opf.getData().toString())
  const xmlDoc = new xml.DOM(parsed)

  let images = []

  let jpegs = xmlDoc.document.getElementsByAttribute('media-type', 'image/jpeg')
  let jpgs = xmlDoc.document.getElementsByAttribute('media-type', 'image/jpg')
  let pngs = xmlDoc.document.getElementsByAttribute('media-type', 'image/png')
  let gifs = xmlDoc.document.getElementsByAttribute('media-type', 'gif')

  for (let jpeg of jpegs) {
    let href = jpeg.attributes['href']
    images.push({
      filename: href,
      entry: entries[href] || entries[href.split('/').pop()]
    })
  }

  for (let jpg of jpgs) {
    let href = jpg.attributes['href']
    images.push({
      filename: href,
      entry: entries[href] || entries[href.split('/').pop()]
    })
  }

  for (let png of pngs) {
    let href = png.attributes['href']
    images.push({
      filename: href,
      entry: entries[href] || entries[href.split('/').pop()]
    })
  }

  for (let gif of gifs) {
    let href = gif.attributes['href']
    images.push({
      filename: href,
      entry: entries[href] || entries[href.split('/').pop()]
    })
  }


  return images
}

const GetNcxChapterInfo = (ncx, entries) => {
  const ncxParsed = xml.parse(ncx.getData().toString())
  const ncxDom = new xml.DOM(ncxParsed)

  let chapters = []

  let navpoints = ncxDom.document.getElementsByTagName('navPoint')
  for (let navpoint of navpoints) {
    let title = navpoint.getElementsByTagName('text')[0].innerXML
    let src = navpoint.getElementsByTagName('content')[0].attributes['src']
    let entry = entries[src] || entries[src.split('/').pop()]

    if (title && entry) {
      chapters.push({
        title,
        entry
      })
    }
  }

  return chapters
}

const GetNavChapterInfo = (nav, entries) => {
  const navParsed = xml.parse(nav.getData().toString())
  const navDom = new xml.DOM(navParsed)

  let chapters = []

  let navElem = navDom.document.getElementsByAttribute('epub:type', 'toc')[0]
  let links = navElem.getElementsByTagName('a')

  for (let link of links) {
    let title = link.innerXML
    let src = link.attributes['href']
    let entry = entries[src] || entries[src.split('/').pop()]

    if (title && entry) {
      chapters.push({
        title,
        entry
      })
    }
  }

  return chapters
}