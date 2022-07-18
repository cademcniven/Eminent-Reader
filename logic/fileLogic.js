const fs = require('fs').promises

const rootFolder = './novels'

exports.UpdateNovel = async metadata => {
  const folderName = `${rootFolder}/${metadata.key}`

  await fs.mkdir(folderName, { recursive: true })

  const metadataJson = `${folderName}/metadata.json`

  try {
    await fs.access(metadataJson)
    console.log('Metadata exists')
    return
  } catch (err) {
    console.log(`Downloading metadata for ${metadata.title}`)
    return fs.writeFile(metadataJson, JSON.stringify(metadata))
  }
}

exports.DownloadChapter = async (chapterData, index, metaData) => {
  const path = `${rootFolder}/${metaData.key}`
  const indexJson = `${path}/${index}.json`
  try {
    await fs.exists(indexJson)
    return
  } catch (err) {
    console.log(`Downloading chapter ${index}/${metaData.chapters} of ${metaData.title}`)
    return fs.writeFile(indexJson, JSON.stringify(chapterData))
  }
}

exports.UpdateMetadata = metadata => {
  console.log(`Updating metadata for ${metadata.title}`)

  return fs.writeFile(`${rootFolder}/${metadata.key}/metadata.json`, JSON.stringify(metadata))
}

exports.GetAllNovels = async () => {
  const novels = []

  let folders = []
  try {
    folders = await fs.readdir(rootFolder, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Could not find ${rootFolder}, creating directory.`)
      await fs.mkdir(rootFolder)
    } else {
      console.error(error)
    }
  }

  for (const folder of folders) {
    if (!folder.isDirectory()) {
      continue
    }
    try {
      novels.push(JSON.parse(await fs.readFile(`${rootFolder}/${folder.name}/metadata.json`, 'utf8')))
    } catch (error) {
      console.error(error)
    }
  }

  return novels
}

exports.GetUserSettings = async () => {
  let filename = './settings/userSettings.json'
  try {
    return JSON.parse(await fs.readFile(filename))
  } catch (err) {
    return fs.writeFile(filename, JSON.stringify(new Object()))
  }
}

exports.SetUserSettings = async (settings) => {
  return fs.writeFile('./settings/userSettings.json', JSON.stringify(settings))
}

exports.GetSettings = async () => {
  return JSON.parse(await fs.readFile('./settings/settings.json'))
}