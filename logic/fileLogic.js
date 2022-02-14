const fs = require('fs')

exports.UpdateNovel = function (title) {
    let rootFolder = "../novels"
    let folderName = `${rootFolder}/${title}`

    if (!FolderExists(rootFolder))
        CreateFolder(rootFolder)

    if (!FolderExists(folderName))
        CreateFolder(folderName)

    if (!FolderExists(folderName))
        return


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
    }
}