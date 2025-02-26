import { checkDir, processTag, filterTag } from "../utils/common";
import { settings } from "../utils/settings";
import { IImage } from "../utils/types";
import { pipeline } from "stream";
import { createWriteStream, createReadStream, WriteStream } from "fs";
import { Readable } from "stream";
import path from "path";
import { setTimeout } from "timers/promises";
import chalk from "chalk"
const LINE_CLEAR = '\x1b[2K\r'

export async function getImages(tags: string) {
    const fullUrl = settings.url.concat(`&tags=${tags}`)
    try {
        console.log(chalk.cyan(`Finding images with ${tags} tag`))
        const request = await fetch(fullUrl);
        if (!request.ok) {
            throw Error("Error occured")

        }
        const response: IImage[] = await request.json();
        console.log(chalk.yellow(`Found ${response.length} images`))
        await setTimeout(1000)
        const { images, filteredCount } = filterTag(response)
        console.log(chalk.cyan(`Start filtering images...`))
        console.log(chalk.yellow(`${filteredCount} Image(s) filtered, ${images.length} images left are save!`))
        console.log("")
        await setTimeout(1000)
        return images;
    } catch (err) {
        throw err;
    }
}

export async function download(url: string, destination: string, fileName: string, left: number) {
    const fullLocation = path.join(destination, fileName)
    try {
        const writer = createWriteStream(fullLocation)
        const request = await fetch(url);
        if (!request.body) {
            throw ("response type aren't body")
        }
        const response = request.body?.getReader()
        async function processStream() {
            process.stdout.write(`${LINE_CLEAR}${chalk.yellow("[" + (left - 1) + " left]")} ${chalk.cyan("Downloading : " + fileName)}`)
            while (true) {
                const { done, value } = await response.read();
                if (done) break;

                writer.write(value);
            }
            process.stdout.write(`${LINE_CLEAR}${chalk.yellow("[" + (left - 1) + " left]")} ${chalk.yellow("Done downloading :" + fileName)}`)
            writer.close();
            await setTimeout(1000)
        };
        await processStream();
    }
    catch (err) {
        throw err
    }
}