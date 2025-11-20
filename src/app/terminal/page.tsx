"use client";
import data from "@/data/constants.json";
import { FileSystemRoot } from "@/data/type";
import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useEffect, useState } from "react";
import CommandLine from "@/components/commandLine";
import { CommandOutput, Error } from "@/components/commandOutput";
import { Help, SplashScreen } from "@/components/constantOutput";
import { cat, cd, ls } from "@/components/commands";

const MAX_CONTENT: number = 10;
const fileSystemRoot: FileSystemRoot = data as FileSystemRoot;

enum commands {
    quit,
    gui,
    editor,
    clear,
    help,
    error,
    cwd,
    ls,
    cat,
    cd,
    // todo
    bat // huge plus
}

function matcher(input: string | undefined): commands {
    if (!input) return commands.error
    if (input === "code .") return commands.editor;

    const command = input.split(" ").at(0)?.trim();

    if (command === "quit" || command === 'exit') return commands.quit;
    if (command === "gui") return commands.gui;
    if (command === "clear") return commands.clear;
    if (command === "help") return commands.help;
    if (command === "cwd" || command === "pwd") return commands.cwd;
    if (command === "ls") return commands.ls;
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
            case commands.cwd:
                setcontent((content) => boundedSet(content, <CommandOutput cwd={cwd} command={input} >{cwd}</CommandOutput>));
                break;
            case commands.ls:
                setcontent((content) => boundedSet(content, ls(cwd, input)));
                break;
            case commands.cat:
                setcontent((content) => boundedSet(content, cat(cwd, input)));
                break;
            case commands.cd:
                setCwd(curr => cd(curr, input));
                setcontent((content) => boundedSet(content, <CommandOutput cwd={cwd} command={input} > <></></CommandOutput >));
                break;

            default:
                setcontent((content) => boundedSet(content, <Error cwd={cwd} command={input} help={false}>
                    <pre>&apos;{input.split(" ").at(0)?.trim()}&apos; is not a recognized command.
                    </pre>
                </Error>));
        }

        setInput("");
        setHistoryIndex(-1); // Reset history navigation on new command
    }

    useEffect(() => {
        // to put focus on the input even if clicked anywhere in the page
        function handleClick() {
            document.querySelector("input")?.focus();
        }

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior: "smooth" });
    }, [content]);

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "ArrowUp") {
            // Navigate to previous command
            if (commandStore.length > 0 && historyIndex < commandStore.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandStore[commandStore.length - 1 - newIndex]); // Fetch command in reverse order
            }
        } else if (event.key === "ArrowDown") {
            // Navigate to next command
            if (historyIndex > -1) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandStore[commandStore.length - 1 - newIndex]);
            }
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
                    onKeyDown={handleKeyDown} // Handle arrow key navigation
                    type="text"
                />
            </form>
        </div>
    );
}