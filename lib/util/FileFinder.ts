import fs, { PathLike } from 'fs';
import path from 'path';

const separator = path.sep;

const findFilesAndSubdirectories = (base: PathLike, files: string[]): void => {
    fs.readdirSync(base).forEach((file) => {
        const path: string = base + separator + file;

        if (fs.lstatSync(base + separator + file).isFile()) {
            return files.push(path);
        }

        if (fs.lstatSync(base + separator + file + separator).isDirectory()) {
            findFilesAndSubdirectories(path, files);
        }
    });
};

export const findSubdirectories = (base: PathLike): string[] => {
    const directories: string[] = [];

    fs.readdirSync(base).forEach((file) => {
        const path: string = base + separator + file + separator;

        if (fs.lstatSync(path).isDirectory()) {
            directories.push(path);
        }
    });

    return directories;
};

export const findRoutes = (base: PathLike): string[] => {
    const files: string[] = [];

    findFilesAndSubdirectories(base, files);

    return files;
};
