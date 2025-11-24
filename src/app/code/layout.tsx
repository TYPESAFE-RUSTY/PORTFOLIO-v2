"use client";

import "./code.css";
import Link from "next/link";
import data from "@/data/constants.json";
import { FileNode, FileSystemRoot } from "@/data/type";
import { useState } from "react";
import FileView from "./page";
import { getLogo } from "@/components/commands";


const border: string = "border-ctp-text/20"
const fileSystemRoot: FileSystemRoot = data as FileSystemRoot;
// todo!("Save this in session storage and use ctrl s to update storage")
let pathDataMap: Map<string, string> = new Map();

const getFileName = (item: FileNode) => {
    const renderFileName = item.fileName;
    return `${renderFileName}${item.fileType == 'folder' ? '' : '.'}${item.fileExtension ? item.fileExtension : ''}`;
}

const getPath = (fragment: string, fileName: string) => fragment + '/' + fileName

export default function RootLayout() {

    // expanded folder are 
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['~']));
    const [activeDoc, setActiveDoc] = useState<string>('');
    const [available, setAvailable] = useState<Set<string>>(new Set());

    // function to open or close folder
    const toggleFolder = (e: React.MouseEvent<HTMLButtonElement>) => {
        const name = e.currentTarget.name;
        setExpandedFolders(curr => {
            let result = new Set(curr);
            result.has(name) ? result.delete(name) : result.add(name);
            return result;
        })
    }

    // function to change active document
    const toggleActiveDoc = (e: React.MouseEvent<HTMLButtonElement>) => {
        const name = e.currentTarget.name;
        setActiveDoc(name);
        setAvailable(curr => {
            let res = new Set(curr);
            res.add(name);
            return res;
        });
    }

    const handleClose = (name: string) => {
        setAvailable(curr => {
            let res = new Set(curr);
            res.delete(name);
            return res;
        })

        setActiveDoc(curr => {
            if (name !== curr) return curr;

            let availableDocs: any = new Set(available);
            availableDocs.delete(curr);
            availableDocs = Array.from(availableDocs);
            if (availableDocs.length === 0) return '';

            return availableDocs[0];
        })
    }

    // function to dfs based on state and no indententation after 1 level deep.
    const fileSystem = () => {
        let result: React.ReactNode[] = [];
        type iter = [FileNode, string, number]
        let stack: iter[] = fileSystemRoot.data.files.map(item => [item, '~', 0]);

        while (stack.length > 0) {
            let top = stack.pop();
            if (!top) break;// no need for this check but added for ts

            let [item, path, depth] = top;
            const name = getFileName(item);
            path = getPath(path, name); // always unique do not fumble this in constants

            if (item.fileType != 'folder') {
                // current item is a file
                result.push(
                    <button key={name} name={path} className={`text-start px-2 ${depth > 0 ? 'text-xs ml-5 py-1.5' : ''}`}
                        onClick={(e) => toggleActiveDoc(e)}
                    >
                        {getLogo(item.fileExtension)} {name}
                    </button>
                )

                pathDataMap.set(path, JSON.stringify(item.data, null, 4));
            }

            if (item.fileType == 'folder') {
                // current item is a folder
                result.push(<button key={name}
                    name={path}
                    className={`text-start px-2 ${depth > 0 ? 'text-xs ml-5 py-1.5' : ''}`}
                    onClick={(e) => toggleFolder(e)}>
                    {getLogo('', !expandedFolders.has(path))} {name}
                </button>)
                if (expandedFolders.has(path)) {
                    item.data.files.forEach(i => stack.push([i, path, depth + 1]));
                }
            }


        }
        return result;
    }

    return (
        <section className={`${border} border rounded-[5px] overflow-hidden h-full`} id="editor-layout">
            <header className={`${border} border-b min-h-8 py-0.5 px-2 font-bold text-s bg-ctp-crust flex justify-between`}>
                <h1>PORTFOLIO v2</h1>
                <Link href={"/terminal"} className="px-2">
                    
                </Link>
            </header>
            <main className="flex min-h-full flex-col md:flex-row">
                <aside className={`${border} min-w-64 border-b md:border-r md:border-b-0 m-h-8 md:min-h-full flex flex-row flex-wrap md:flex-col bg-ctp-mantle`}>
                    {
                        fileSystem()
                    }
                </aside>
                <FileView
                    currentlyActive={activeDoc}
                    available={available}
                    code={pathDataMap.get(activeDoc) || ""}
                    handleActiveChange={setActiveDoc}
                    handleClose={handleClose}
                />
            </main>
        </section>
    );
}
