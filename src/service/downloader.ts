import { checkDir, processTag } from "../utils/common";
import { settings } from "../utils/settings";
import { IImage } from "../utils/types";
import { pipeline } from "stream";
import { createWriteStream, createReadStream, WriteStream } from "fs";
import { Readable } from "stream";
import path from "path";
import { setTimeout } from "timers/promises";
import chalk from "chalk"


export async function getImages(tags: string) {
    const fullUrl = settings.url.concat(`&tags=${tags}`)
    try {
        const request = await fetch(fullUrl);
        const response: IImage[] = await request.json();
        return response;
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
            console.log(`${chalk.cyan("downloading")} ${chalk.green(fileName)} ${chalk.yellow("[" + left + " left]")}`)
            while (true) {
                const { done, value } = await response.read();
                if (done) break;

                writer.write(value);
            }

            console.log(`${chalk.blue("Done downloading, writing data to")} ${chalk.green(fullLocation)}`)
            console.log("<----------------------------------------------------->")
            writer.close();
            await setTimeout(1000)
        };
        await processStream();
    }
    catch (err) {
        throw err
    }
}