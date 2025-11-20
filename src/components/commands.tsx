import data from "@/data/constants.json"
import { FileNode, FileSystemRoot, FolderNode } from "@/data/type";
import { CommandOutput, Error } from "./commandOutput";

const fileSystemRoot: FileSystemRoot = data as FileSystemRoot;

export const getLogo = (extension: string | null, open: boolean = false) => {
    switch (extension) {
        case "json":
            return '';
        case "md":
            return '';
        case "cpp":
            return '󰙲';
        default:
            return open ? '' : '';
    }
}


function reprFolder(name: string) { return <p>drwx <span className="text-ctp-blue"></span > {name}</p> }
function reprFile(name: string, extension: "json" | "cpp" | null) { return <p>.rwx <span className="text-ctp-blue">{getLogo(extension)}</span> {name}.{extension}</p> }

export const ls = (cwd: string, input: string) => {
    if (input.split(" ").length !== 1) return <Error cwd={cwd} command={input} help>[USAGE] : ls</Error>

    // iterate to the target folder
    const folder = cwd.split('/').reverse();
    folder.pop() // remove "root" from the cwd
    const currentLocation = travelTree(fileSystemRoot, folder);

    // get folders and files
    let folders = getFolders(currentLocation).map(elem => reprFolder(elem.fileName));
    let files = getFiles(currentLocation).map(elem => reprFile(elem.fileName, elem.fileExtension));
    return <CommandOutput cwd={cwd} command={input}>
        {...folders}
        {...files}
    </CommandOutput>;
}

export const cat = (cwd: string, input: string) => {
    let args = input.split(" ");
    if (args.length !== 2) return <Error cwd={cwd} command={input} help><p>[USAGE] : cat &lt;command&gt;</p></Error>

    const file = args.pop();
    // iterate to the target folder
    const folder = cwd.split('/').reverse();
    folder.pop() // remove "root" from the folder
    const currentLocation = travelTree(fileSystemRoot, folder);

    // get all the files
    let files = getFiles(currentLocation);
    let res = files.filter(elem => file === elem.fileName + '.' + elem.fileExtension).at(0);

    if (!res) return <Error cwd={cwd} command={input} help><p>No file named {file}</p></Error>

    // render files content
    return <CommandOutput cwd={cwd} command={input}>
        <pre className="font-nerd-font-mono text-wrap">
            {JSON.stringify(res.data, null, 4)}
        </pre>
    </CommandOutput>
}

export const cd = (cwd: string, input: string): string => {
    let temp = cwd.split('/');
    let target = input.split(' ')[1].split('/');
    // check for faults
    target.forEach(elem => elem === ".." ? temp.pop() : temp.push(elem));
    temp.reverse().pop();
    let final = [...temp];

    try {
        travelTree(fileSystemRoot, temp);
        final.push('~');
        const res = final.reverse().join('/');
        return res;
    } catch (error) {
        return cwd;
    }
}

// iterate to the folder
function travelTree(location: FolderNode, dir: string[]) {
    const target = dir.pop();
    let folder = getFolders(location);
    if (!target) return location;
    if (location.fileType !== "folder") return location;

    folder = folder.filter((elem) => elem.fileName === target)
    if (folder.length === 0) throw "no such folder";
    return travelTree(folder[0], dir);
}

function getFolders(location: FolderNode = fileSystemRoot): FolderNode[] {
    let res: FileNode[] = location.data.files;
    return res.filter((elem) => elem.fileType === "folder")
}

function getFiles(location: FolderNode = fileSystemRoot): FileNode[] {
    let res: FileNode[] = location.data.files;
    return res.filter((elem) => elem.fileType === "file")
}

interface prv {
    location: FolderNode,
    parent: FolderNode | null
}

function getParentFolder(location: FolderNode, parent: FolderNode | null, dir: string[]): prv {
    const target = dir.pop();
    let folder = getFolders(location);
    if (!target) return { location, parent };
    if (location.fileType !== "folder") return { location, parent };

    folder = folder.filter((elem) => elem.fileName === target)
    if (folder.length === 0) throw "no such folder";
    return getParentFolder(folder[0], location, dir);

}