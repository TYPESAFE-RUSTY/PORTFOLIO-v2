import { commandOutput, exec, ExitCode, mri } from "faketerm";
import { SetStateAction } from "react";
import { boundedSet, HistoryItem } from "./page";

export class clear extends exec {
  target: (value: SetStateAction<HistoryItem[]>) => void;
  input: (value: SetStateAction<string>) => void;

  protected parse(_args: string[]): void {}

  constructor(
    target: (value: SetStateAction<HistoryItem[]>) => void,
    input: (value: SetStateAction<string>) => void,
  ) {
    super();
    this.target = target;
    this.input = input;
  }

  run(_args: string[]): commandOutput {
    this.target([]);
    this.input("");
    console.clear();

    return new commandOutput(
      ExitCode.EXIT_SUCCESS,
      "[clear] : console was cleared",
    );
  }

  man(): string {
    return `
NAME
      clear - clear the terminal screen

SYNOPSIS
      clear

DESCRIPTION
      Clears the terminal output history. 
      
      If the terminal is cluttered, this command will remove all 
      previous command outputs from the visible screen and reset 
      the viewport, leaving a clean workspace.
        `;
  }

  completion(_args: string[]): string[] {
    return [];
  }
}

export class help extends exec {
  protected parse(_args: string[]): void {}

  run(_args: string[]): commandOutput {
    return new commandOutput(
      ExitCode.EXIT_SUCCESS,
      `Available Commands : ${this.context.commandRegistry.keys().toArray().join(", ")}.`,
    );
  }

  man(): string {
    return `
NAME
      help - display information about builtin commands

SYNOPSIS
      help

DESCRIPTION
      Outputs a helpful list containing the currently 
      registered commands within the portfolio shell. 
      
      It acts as a quick reference for users who are unsure 
      of what commands are available or how to navigate the 
      virtual file system.
        `;
  }

  completion(_args: string[]): string[] {
    return [];
  }
}

export class splash extends exec {
  target: (value: SetStateAction<HistoryItem[]>) => void;

  protected parse(_args: string[]): void {}

  constructor(target: (value: SetStateAction<HistoryItem[]>) => void) {
    super();
    this.target = target;
  }

  run(_args: string[]): commandOutput {
    this.target((commands) => boundedSet(commands, "splash"));
    return new commandOutput(ExitCode.EXIT_SUCCESS);
  }

  man(): string {
    return ``;
  }

  completion(_args: string[]): string[] {
    return [];
  }
}

export class alias extends exec {
  aliasName: string | null = null;
  command: string | null = null;

  protected parse(args: string[]): void {
    const opts = mri(args);
    this.aliasName = opts._[0] || null;
    this.command = opts._[1] || null;

    if (this.aliasName === "" || this.command === "")
      throw "Insufficient arguments.";
  }

  run(args: string[]): commandOutput {
    try {
      this.parse(args);
    } catch (e) {
      return new commandOutput(ExitCode.EXIT_FAILURE, null, JSON.stringify(e));
    }

    let commandClass = this.context.commandRegistry.get(this.command || "");

    if (!commandClass || !this.aliasName) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `[alias] unknown command ${this.command}`,
      );
    }

    this.context.commandRegistry.set(this.aliasName, commandClass);
    return new commandOutput(ExitCode.EXIT_SUCCESS);
  }

  man(): string {
    return `
usage : 
    alias [aliasName] [command]
        `;
  }

  completion(_args: string[]): string[] {
    return [];
  }
}

export class vim extends exec {
  protected parse(_args: string[]): void {}
  run(_args: string[]): commandOutput {
    return new commandOutput(
      ExitCode.EXIT_FAILURE,
      null,
      `Error: Cannot open vim.
I didn't implement it because I was afraid you wouldn't know how to exit it.

Try 'cat <filename>' instead.`,
    );
  }
  completion(_args: string[]): string[] {
    return [];
  }
  man(): string {
    return ``;
  }
}

export class sudo extends exec {
  protected parse(_args: string[]): void {}
  run(args: string[]): commandOutput {
    console.log(args);
    if (args.length <= 1 && args[0] === "")
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        "usage: sudo <command>",
      );

    return new commandOutput(
      ExitCode.EXIT_FAILURE,
      null,
      `Guest is not in the sudoers file.
This incident will be reported to Santa.

Wait... you thought you had root privileges on my portfolio?`,
    );
  }
  completion(args: string[]): string[] {
    return [];
  }
  man(): string {
    return ``;
  }
}
