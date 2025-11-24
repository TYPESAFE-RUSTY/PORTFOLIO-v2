"use client";
import data from "@/data/constants.json";
import { constTree, FileSystemRoot } from "@/data/type";
import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useEffect, useState } from "react";
import CommandLine from "@/components/commandLine";
import { CommandOutput, Error } from "@/components/commandOutput";
import { Help, SplashScreen } from "@/components/constantOutput";
import { cat, cd, ls, unsafeLs } from "@/components/commands";

const MAX_CONTENT: number = 10;
const fileSystemRoot: FileSystemRoot = data as FileSystemRoot;
// these two variables control tab to next feature 
// todo!("find better way to do so.").
let completionOptions: string[] = []
let completionsChoice = 0

enum commands {
    nop,
    quit,
    gui,
    editor,
    clear,
    help,
    error,
    whoami,
    cwd,
    ls,
    cat,
    cd,
    // todo
    tree,
    bat // huge plus
}

function matcher(input: string | undefined): commands {
    // in case of null or empty input just forwar nop
    if (!input || input.trim() === "") { return commands.nop; }


    input = input.trim();
    // command with no need for arguments
    // no need to check anything if input is same open editor
    if (input === "code ." || input === "code ~") return commands.editor;
    if (input === "whoami") return commands.whoami;
    if (input === "cwd" || input === "pwd") return commands.cwd;
    if (input === "quit" || input === 'exit') return commands.quit;
    if (input === "gui") return commands.gui;
    if (input === "clear") return commands.clear;
    if (input === "help") return commands.help;
    if (input === "ls" || input === "dir") return commands.ls;
    if (input === "tree") return commands.tree;

    // commands tha accepts arguments
    const command = input.split(" ").at(0)?.trim().toLowerCase();
    // Check user input and convert it to a vliad commad.
    if (command === "cat") return commands.cat;
    if (command === "cd") return commands.cd;
    return commands.error;
}

function boundedSet<T>(list: T[], item: T) {
    if (list.length === MAX_CONTENT) list.shift();
    return [...list, item];
}

export default function Terminal() {
    const [content, setcontent] = useState<React.ReactNode[]>([<SplashScreen key={0} />]);
    const [commandStore, setCommandStore] = useState<string[]>([]); // Stores history of commands
    const [input, setInput] = useState<string>(""); // Current input in the terminal
    const [historyIndex, setHistoryIndex] = useState<number>(-1); // Tracks position in history
    const [cwd, setCwd] = useState<string>('~'); // Always valid working "DIRECTORY"
    const router = useRouter();

    function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const latestCommand = matcher(input);
        if (latestCommand !== commands.error && input !== commandStore[commandStore.length - 1]) {
            setCommandStore((commandStore) => boundedSet(commandStore, input));
        }

        switch (latestCommand) {
            case commands.nop:
                return setcontent((content) => boundedSet(content, <>
                    <CommandLine cwd={cwd} />
                    <span className="text-ctp-green"></span>
                </>
                ))
            case commands.quit:
                return router.push('/');
            case commands.gui:
                return router.push('/gui');
            case commands.editor:
                return router.push('/code');
            case commands.clear:
                setcontent([]);
                break;
            case commands.help:
                setcontent((content) => boundedSet(content, <Help cwd={cwd} command={input} />));
                break;
            case commands.whoami:
                setcontent((content) => boundedSet(content, <CommandOutput cwd={cwd} command={input}><p>Computer Engineer from India</p></CommandOutput>))
                break;
            case commands.cwd:
                setcontent((content) => boundedSet(content, <CommandOutput cwd={cwd} command={input} >{cwd}</CommandOutput>));
                break;
            case commands.ls:
                setcontent((content) => boundedSet(content, ls(cwd, input)));
                break;
            case commands.tree:
                setcontent((content) => boundedSet(content, <CommandOutput command={input} cwd={cwd} ><>constTree</></CommandOutput>))
                break;
            case commands.cat:
                setcontent((content) => boundedSet(content, cat(cwd, input)));
                break;
            case commands.cd:
                const res = cd(cwd, input);
                if (!res.startsWith('~')) {
                    setcontent((content) => boundedSet(content, <Error cwd={cwd} command={input} help><p>{res}</p></Error>));
                }
                else {
                    setCwd(res);
                    setcontent((content) => boundedSet(content, <CommandOutput cwd={cwd} command={input} > <></></CommandOutput >));
                }

                break;
            default:
                setcontent((content) => boundedSet(content, <Error cwd={cwd} command={input} help={false}>
                    <pre>&apos;{input}&apos; is not a recognized command.
                    </pre>
                </Error>));
        }

        completionsChoice = 0;
        completionOptions = [];
        setInput("");
        setHistoryIndex(-1); // Reset history navigation on new command
    }

    // to transfer user focus on input tag even if clicked anywhere
    useEffect(() => {
        function handleClick() {
            document.querySelector("input")?.focus();
        }

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    // scroll to the bottom on size increase
    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior: "smooth" });
    }, [content]);


    // handle special keys on input tag
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "ArrowUp") {
            if (commandStore.length <= 0 || historyIndex > commandStore.length - 1) return;
            // Navigate to previous command
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setInput(commandStore[commandStore.length - 1 - newIndex]); // Fetch command in reverse order
        }

        if (event.key === "ArrowDown") {
            // Navigate to next command
            if (historyIndex < -1) return
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInput(commandStore[commandStore.length - 1 - newIndex]);
        }
        // for tab to complete (currently ducktaped will find better solution)
        if (event.key === "Tab" && (input.startsWith("cat") || input.startsWith("cd"))) {
            event.preventDefault();
            // check for recommendations only if needed
            if (completionOptions.length === 0) completionOptions = unsafeLs(cwd);
            let cat = input.startsWith('cat');
            setInput(`${cat ? 'cat' : 'cd'} ${completionOptions[completionsChoice]}`)
            completionsChoice = completionsChoice < completionOptions.length - 1 ? completionsChoice + 1 : 0;
        }
    }

    return (
        <div
            style={{ minHeight: "calc(100vh - 1.5rem" }}
            className=" box-border border-2 m-3 p-3 rounded-[5px] overflow-x-clip border-ctp-text/20"
        >
            {content.map((data, index) => <Fragment key={index}>{data}</Fragment>)}
            <CommandLine cwd={cwd} />
            <form onSubmit={(e) => submitHandler(e)} className="flex">
                <span className="text-ctp-green"></span>
                <input
                    name="input"
                    className="bg-transparent text-ctp-yellow outline-none border-none w-full"
                    value={input}
                    autoComplete="off"
                    autoFocus
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown} // Handle arrow key navigation and tab control
                    type="text"
                />
            </form>
        </div>
    );
}