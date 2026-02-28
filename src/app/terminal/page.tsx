"use client";
import data from "@/data/constants.json";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import CommandLine from "@/components/commandLine";
import { CommandOutput, Error } from "@/components/commandOutput";
import { SplashScreen } from "@/components/constantOutput";
import { fakeTerminal } from "faketerm";
import Markdown from "react-markdown";

const MAX_CONTENT: number = 10;

function boundedSet<T>(list: T[], item: T) {
  if (list.length === MAX_CONTENT) list.shift();
  return [...list, item];
}

export default function Terminal() {
  const [content, setcontent] = useState<React.ReactNode[]>([
    <SplashScreen key={0} />,
  ]);

  const terminal = useRef<fakeTerminal>(new fakeTerminal());
  const [input, setInput] = useState<string>(""); // Current input in the terminal
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // initial data for the terminal
    terminal.current.parseFS(JSON.stringify(data));
    terminal.current.setUser("Guest");

    // function to relay focus from page to input
    function handleClick() {
      // only focus if not selecting anything
      if (window.getSelection()?.toString() === "") {
        inputRef.current?.focus();
      }
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);


  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input == "") return;

    const currentDir = terminal.current.runCommand("pwd").stdout() || "~";
    const latestCommandResult = terminal.current.runCommand(input);

    // handle clear and exit state early
    if (input.trim() === "clear") {
      setcontent([]);
      setInput("");
      return;
    }

    if (latestCommandResult.exitCode() === 0) {
      console.log(latestCommandResult.stdout() || latestCommandResult.exitCode());
      // command returned ExitSuccess
      // just add the contents from terminal to the screen
      setcontent((content) =>
        boundedSet(content,
          <CommandOutput cwd={currentDir} command={input} >
            {
              input.trimStart().startsWith("cat") && input.trimEnd().endsWith(".md") ? <Markdown>
                {latestCommandResult.stdout()}
              </Markdown> :
                <pre>
                  {latestCommandResult.stdout()}
                </pre>
            }
          </CommandOutput>
        )
      )
    } else {
      console.warn(latestCommandResult.stderr());
      // command returned ExitError
      // add the contents from the terminal to the screen
      setcontent((content) =>
        boundedSet(content,
          <Error cwd={currentDir} command={input} help>
            <>
              {latestCommandResult.stderr()}
            </>
          </Error>
        )
      )
    }

    setInput("");
  }


  // scroll to the bottom on size increase
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [content]);

  return (
    <div
      style={{ minHeight: "calc(100vh - 1.5rem" }}
      className=" box-border border-2 m-3 p-3 rounded-[5px] overflow-x-clip border-ctp-text/20"
    >
      {content.map((data, index) => (
        <Fragment key={index}>{data}</Fragment>
      ))}
      <CommandLine cwd={terminal.current.runCommand("pwd").stdout() || ""} />
      <form onSubmit={(e) => submitHandler(e)} className="flex">
        <span className="text-ctp-green"></span>
        <input
          name="input"
          className="bg-transparent text-ctp-yellow outline-none border-none w-full"
          value={input}
          autoComplete="off"
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          type="text"
          ref={inputRef}
        />
      </form>
    </div>
  );
}
