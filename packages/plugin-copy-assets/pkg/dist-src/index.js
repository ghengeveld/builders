import copy from 'copy-concurrently';
import path from 'path';
import fs from 'fs';
import { MessageError } from '@pika/types';
export function manifest(manifest, { options }) {
    const files = options.files || ['assets/'];
    manifest.files = (manifest.files || []).concat(files);
}
export async function beforeJob({ cwd, options }) {
    const files = options.files || ['assets/'];
    for (const fileRel of files) {
        const fileLoc = path.join(cwd, fileRel);
        if (!fs.existsSync(fileLoc)) {
            throw new MessageError(`"${fileRel}" does not exist.`);
        }
    }
}
export async function build({ out, cwd, reporter, options }) {
    const files = options.files || ['assets/'];
    for (const fileRel of files) {
        const fileLoc = path.join(cwd, fileRel);
        const writeToLoc = path.join(out, fileRel);
        reporter.info(`copying ${fileRel}...`);
        await copy(fileLoc, writeToLoc);
    }
}
