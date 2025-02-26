import { mkdir, stat } from "fs/promises"
import { isErrnoException } from "../utils/errorHandling";
import path from "path";
import { IImage } from "./types";
import chalk from "chalk";
import { setTimeout } from "timers/promises";

export async function checkDir(dir: string) {
    const fullDir = path.join(dir);
    try {
        console.log(`${chalk.cyan("Checking : ", fullDir)}`)
        const check = await stat(fullDir)
        console.log(chalk.yellow("Directory exist!!"))
        await setTimeout(1000)
    }
    catch (err) {
        if (isErrnoException(err) && err.code === "ENOENT") {
            console.log(chalk.red(`${err.message}`))
            try {
                console.log(chalk.cyan(`Creating directory ${fullDir}`))
                await mkdir(fullDir, { recursive: true });
                console.log(chalk.yellow("Success..."))
                await setTimeout(1000)
            } catch (err) {
                if (isErrnoException(err)) {
                    console.log(chalk.red(`${err.name} ${err.message}`))
                    throw err
                } else { return err }
            }
        }
        else {
            return err
        }
    }
}

export function processTag(tags: string) {
    const filtered = tags.replaceAll(" ", "+").replaceAll("ai_generated", "").replaceAll("_", " ").replaceAll("+", "")
    const raw = tags.replaceAll(" ", "+");
    return { filtered, raw }
}

export function filterTag(images: IImage[]) {
    const filteredImages: IImage[] = [];
    let futaCount = 0;
    for (let x = 0; x < images.length; x++) {
        const tags = images[x].tags.split(" ");
        if (tags.includes("futanari") ||
            tags.includes("1futa") ||
            tags.includes("femboy") ||
            tags.includes("trap") ||
            tags.includes("1boy") ||
            tags.includes("zoophilia")) {
            futaCount++
        }
        else {
            filteredImages.push(images[x])
        }
    }
    return { images: filteredImages, filteredCount: futaCount };
}