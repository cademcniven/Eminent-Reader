const fs = require('fs')

const rootFolder = "./novels"

exports.UpdateNovel = (metadata) => {
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

exports.DownloadChapter = (chapterData, index, metaData) => {
    let path = `${rootFolder}/${metaData.key}`

    if (fs.existsSync(`${path}/${index}.json`)) {
        return
    }

    console.log(`Downloading chapter ${index}/${metaData.chapters} of ${metaData.title}`)

    fs.writeFileSync(`${path}/${index}.json`, JSON.stringify(chapterData), error => {
        if (error)
            console.log(`Received the following error while trying to write ${metaData.title} chapter ${index}: ${error}`)
    })
}

const FolderExists = path => {
    return fs.existsSync(path)
}

const CreateFolder = path => {
    try {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }
    } catch (error) {
        console.error(`${path} does not exist, and the following error was encountered when trying to create it:\n${error}`)
        throw error
    }
}

const WriteMetadata = (path, metadata) => {
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

exports.UpdateMetadata = metadata => {
    console.log(`Updating metadata for ${metadata.title}`)

    fs.writeFileSync(`${rootFolder}/${metadata.key}/metadata.json`, JSON.stringify(metadata), error => {
        if (error)
            console.log(`Received the following error while trying to write novel metadata: ${error}`)
    })
}

exports.GetAllNovels = () => {
    let folders = GetAllNovelFolders('./novels')
    let novels = []

    for (let folder of folders) {
        let metaData = GetNovelMetaData(folder)
        if (metaData)
            novels.push(JSON.parse(metaData))
    }

    return novels
}

const GetAllNovelFolders = path => {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

const GetNovelMetaData = key => {
    try {
        return fs.readFileSync(`./novels/${key}/metadata.json`, "utf8")
    } catch (error) {
        console.log(error)
        return null
    }
}