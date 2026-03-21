"use client";
import data from "@/generated/constants.json";
import { FormEvent, useEffect, useRef, useState } from "react";
import CommandLine from "@/components/commandLine";
import { CommandOutput, Error } from "@/components/commandOutput";
import { SplashScreen } from "@/components/splashScreen";
import { commandOutput, ExitCode, fakeTerminal } from "faketerm";
import { alias, clear, help, splash, sudo, vim } from "./customCommands";
import CatppuccinMarkdown from "@/components/markdown";

const MAX_CONTENT: number = 10;
const USER_NAME: string = "Guest";
const SHELL_NAME: string = "portfolio-shell";
const CLEAR: string = "clear";
const HELP: string = "help";
const SPLASH: string = "splash";
const ALIAS: string = "alias";
const SUDO: string = "sudo";
const VIM: string = "vim";
const UI_COMMANDS: string[] = [CLEAR, SPLASH];

export type HistoryItem =
  | {
      id: string;
      type: ExitCode;
      cwd: string;
      command: string;
      output: string | null;
      isMarkdown?: boolean;
    }
  | "splash";

export function boundedSet<T>(list: T[], item: T) {
  if (list.length === MAX_CONTENT) list.shift();
  return [...list, item];
}

export default function Terminal() {
  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  // Tab completion refs
  const completionsRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isCyclingRef = useRef<boolean>(false);

  // states
  const [contentHistory, setContentHistory] = useState<HistoryItem[]>([
    "splash",
  ]);

  const [input, setInput] = useState<string>("");
  const [terminal] = useState<fakeTerminal>(() => {
    const _fakeTerminal = new fakeTerminal();
    // set constants
    _fakeTerminal.setUser(USER_NAME);
    _fakeTerminal.setShellName(SHELL_NAME);
    _fakeTerminal.parseFS(JSON.stringify(data));

    // set commands
    _fakeTerminal.registerCommand(
      CLEAR,
      () => new clear(setContentHistory, setInput),
    );
    _fakeTerminal.registerCommand(SPLASH, () => new splash(setContentHistory));
    _fakeTerminal.registerCommand(HELP, () => new help());
    _fakeTerminal.registerCommand(ALIAS, () => new alias());
    _fakeTerminal.registerCommand(VIM, () => new vim());
    _fakeTerminal.registerCommand(SUDO, () => new sudo());

    // set alias
    _fakeTerminal.runCommand("alias dir ls");
    _fakeTerminal.runCommand("alias cwd pwd");

    console.log(_fakeTerminal.getRegisteredCommands().join(", "));

    return _fakeTerminal;
  });
  const [cwd, setCwd] = useState<string>(terminal.getPresentWorkingDirectory());

  // initalization
  useEffect(() => {
    // function to relay focus from page to input
    function handleClick() {
      // only focus if not selecting anything
      if (window.getSelection()?.toString() === "") {
        inputRef.current?.focus();
      }
    }

    // populate data
    const tree = "ls -t";
    const readme = "cat README.md";
    const treeOutput = terminal.runCommand(tree);

    setContentHistory((content) => [
      ...content,
      {
        id: crypto.randomUUID(),
        type: treeOutput.exitCode(),
        cwd: terminal.getPresentWorkingDirectory(),
        command: tree,
        output: treeOutput.stdout(),
        isMarkdown: false,
      },
    ]);

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // scroll to the bottom on size increase
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [contentHistory]);

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanInput = input.trim();
    if (cleanInput == "") return;

    const pwd = terminal.getPresentWorkingDirectory();
    let result: commandOutput = terminal.runCommand(input);

    // run on console as well!
    if (result.exitCode() === ExitCode.EXIT_SUCCESS) {
      console.log("SUCCESS\n", result.stdout());
    } else {
      console.warn("ERROR\n", result.stderr());
    }

    let currentItem: HistoryItem = {
      id: crypto.randomUUID(),
      type: result.exitCode(),
      cwd: pwd,
      command: input,
      output:
        result.exitCode() === ExitCode.EXIT_SUCCESS
          ? result.stdout()
          : result.stderr(),
      isMarkdown: cleanInput.startsWith("cat"),
    };

    const uiCommand = UI_COMMANDS.map((command) =>
      cleanInput.split(" ")[0].includes(command),
    ).reduce((p, n) => p || n);
    if (!uiCommand) {
      setContentHistory((content) => boundedSet(content, currentItem));
    }
    setInput("");
    setCwd(terminal.getPresentWorkingDirectory());
  }

  // handle Tab completion keydowns
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") {
      e.preventDefault();

      const tokens = input.split(" ");

      if (!isCyclingRef.current) {
        const completions = terminal.completions(input).reverse();
        completionsRef.current = completions;

        if (completions.length === 0) return;

        if (completions.length === 1) {
          tokens.pop();
          tokens.push(completions[0]);
          setInput(tokens.join(" "));
        } else {
          currentIndexRef.current = 0;
          isCyclingRef.current = true;
          tokens.pop();
          tokens.push(completions[0]);
          setInput(tokens.join(" "));
        }
      } else {
        const completions = completionsRef.current;
        currentIndexRef.current =
          (currentIndexRef.current + 1) % completions.length;
        tokens.pop();
        tokens.push(completions[currentIndexRef.current]);
        setInput(tokens.join(" "));
      }
    } else {
      isCyclingRef.current = false;
      completionsRef.current = [];
      currentIndexRef.current = -1;
    }
  }

  return (
    <div
      style={{ minHeight: "calc(100vh - 1.5rem)" }}
      className=" box-border border-2 m-3 p-3 rounded-[5px] overflow-x-clip border-ctp-text/20"
    >
      {
        // handle ui rendering
        contentHistory.map((element) => {
          if (element === "splash") {
            return (
              <SplashScreen
                key="splash-screen"
                commands={terminal.getRegisteredCommands()}
              />
            );
          }

          if (element.type === ExitCode.EXIT_SUCCESS) {
            return (
              <CommandOutput
                userName={USER_NAME}
                key={element.id}
                cwd={element.cwd}
                command={element.command}
              >
                {element.isMarkdown ? (
                  <CatppuccinMarkdown>
                    {element.output || ""}
                  </CatppuccinMarkdown>
                ) : (
                  <pre className=" text-wrap">{element.output}</pre>
                )}
              </CommandOutput>
            );
          } else {
            return (
              <Error
                userName={USER_NAME}
                key={element.id}
                cwd={element.cwd}
                command={element.command}
                help={false}
              >
                <pre className=" text-wrap">{element.output}</pre>
              </Error>
            );
          }
        })
      }
      <CommandLine userName={USER_NAME} cwd={cwd} />
      <form onSubmit={(e) => submitHandler(e)} className="flex">
        <span className="text-ctp-green"></span>
        <input
          name="input"
          className="bg-transparent text-ctp-yellow outline-none border-none w-full"
          value={input}
          autoComplete="off"
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          ref={inputRef}
        />
      </form>
    </div>
  );
}
