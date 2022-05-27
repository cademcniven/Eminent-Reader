const fs = require('fs')

const rootFolder = './novels'

exports.UpdateNovel = metadata => {
  const folderName = `${rootFolder}/${metadata.key}`

  fs.mkdirSync(folderName, { recursive: true })

  const metadataJson = `${folderName}/metadata.json`

  if (fs.existsSync(metadataJson)) {
    console.log('Metadata exists')
    return
  }

  console.log(`Downloading metadata for ${metadata.title}`)

  fs.writeFileSync(metadataJson, JSON.stringify(metadata))
}

exports.DownloadChapter = (chapterData, index, metaData) => {
  const path = `${rootFolder}/${metaData.key}`
  const indexJson = `${path}/${index}.json`
  if (fs.existsSync(indexJson)) {
    return
  }

  console.log(`Downloading chapter ${index}/${metaData.chapters} of ${metaData.title}`)

  fs.writeFileSync(indexJson, JSON.stringify(chapterData))
}

exports.UpdateMetadata = metadata => {
  console.log(`Updating metadata for ${metadata.title}`)

  fs.writeFileSync(`${rootFolder}/${metadata.key}/metadata.json`, JSON.stringify(metadata))
}

exports.GetAllNovels = () => {
  const folders = fs.readdirSync(rootFolder, { withFileTypes: true })
  const novels = []

  for (const folder of folders) {
    if (!folder.isDirectory()) {
      continue
    }
    const metaData = GetNovelMetaData(folder)
    if (metaData) {
      novels.push(JSON.parse(metaData))
    }
  }

  return novels
}

const GetNovelMetaData = key => {
  try {
    return fs.readFileSync(`${rootFolder}/${key}/metadata.json`, 'utf8')
  } catch (error) {
    console.log(error)
    return null
  }
}
