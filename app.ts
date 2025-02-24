import process from "process";
import { checkDir, processTag } from "./src/utils/common";
import { getImages, download } from "./src/service/downloader";
import { settings } from "./src/utils/settings";
import path from "path";

async function main() {
    const args = process.argv.slice(2);
    try {
        const { filtered, raw } = processTag(args[0])
        const destination = path.join(settings.parentDir, filtered)
        const images = await getImages(raw);
        await checkDir(destination)
        for (let x = 0; x < images.length; x++) {
            await download(images[x].file_url, destination, images[x].image, images.length - x)
        }
    }

    catch (err) {
        console.log(err)
    }
}

main()