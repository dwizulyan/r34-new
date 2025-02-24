import { mkdir, stat } from "fs/promises"
import { isErrnoException } from "../utils/errorHandling";
import path from "path";
import { settings } from "../utils/settings";

export async function checkDir(dir: string) {
    const fullDir = path.join(dir);
    try {
        const check = await stat(fullDir)
        console.log("Directory exist!!")
    }
    catch (err) {
        if (isErrnoException(err) && err.code === "ENOENT") {
            console.log(`${err.name} ${err.message}`)
            try {
                console.log(`Creating directory ${fullDir}`)
                await mkdir(fullDir, { recursive: true });
                console.log("Success...")
            } catch (err) {
                if (isErrnoException(err)) {
                    console.log(`${err.name} : ${err.message} (${err.code})`)
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