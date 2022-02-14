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

    switch (hostname) {
        case "syosetu":
            ScrapeSyosetu(url)
            break
        case "kakuyomu":
            ScrapeKakuyomi(url)
            break
        default:
            console.log("Provided url is from an unsupported host")
    }
}

function ScrapeSyosetu(url) {

}

function ScrapeKakuyomi(url) {

}