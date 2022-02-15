const fs = require('fs')

const rootFolder = "./novels"

exports.UpdateNovel = function (metadata) {
    let folderName = `${rootFolder}/${metadata.key}`

    if (!FolderExists(rootFolder)) {
        try {
            CreateFolder(rootFolder)
        } catch (error) {
            return
        }
    }

    if (!FolderExists(folderName)) {
        try {
            CreateFolder(folderName)
        } catch (error) {
            return
        }
    }

    WriteMetadata(folderName, metadata)
}

exports.DownloadChapter = function (chapterData, index, metaData) {
    let path = `${rootFolder}/${metaData.key}`

    if (fs.existsSync(`${path}/${index}.json`)) {
        return
    }

    console.log(`Downloading chapter ${index}/${metaData.chapters} of ${metaData.title}`)

    fs.writeFileSync(`${path}/${chapterData.title}.json`, JSON.stringify(chapterData), error => {
        if (error)
            console.log(`Received the following error while trying to write ${metaData.title} chapter ${index}: ${error}`)
    })
}

function FolderExists(path) {
    return fs.existsSync(path)
}

function CreateFolder(path) {
    try {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }
    } catch (error) {
        console.error(`${path} does not exist, and the following error was encountered when trying to create it:\n${error}`)
        throw error
    }
}

function WriteMetadata(path, metadata) {
    if (fs.existsSync(`${path}/metadata.json`)) {
        console.log("Metadata exists")
        return
    }

    console.log(`Downloading metadata for ${metadata.title}`)

    fs.writeFileSync(`${path}/metadata.json`, JSON.stringify(metadata), error => {
        if (error)
            console.log(`Received the following error while trying to write novel metadata: ${error}`)
    })
}

exports.UpdateMetadata = (metadata) => {
    console.log(`Updating metadata for ${metadata.title}`)

    fs.writeFileSync(`${rootFolder}/${metadata.key}/metadata.json`, JSON.stringify(metadata), error => {
        if (error)
            console.log(`Received the following error while trying to write novel metadata: ${error}`)
    })
}