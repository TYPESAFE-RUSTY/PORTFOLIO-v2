import CommandLine from "./commandLine"
import { Error } from "./commandOutput"

const SPLASH: string = `  ___ ___         .__  .__                               .__       .___._.
 /   |   \\   ____ |  | |  |   ____   __  _  _____________|  |    __| _/| |
/    ~    \\_/ __ \\|  | |  |  /  _ \\  \\ \\/ \\/ /  _ \\_  __ \\  |   / __ | | |
\\    Y    /\\  ___/|  |_|  |_(  <_> )  \\     (  <_> )  | \\/  |__/ /_/ |  \\|
 \\___|_  /  \\___  >____/____/\\____/    \\/\\_/ \\____/|__|  |____/\\____ |  __
       \\/       \\/                                                  \\/  \\/
`

const HELP: string = `  ___ ___         .__
 /   |   \\   ____ |  | ______
/    ~    \\_/ __ \\|  | \\____ \\
\\    Y    /\\  ___/|  |_|  |_> >
 \\___|_  /  \\___  >____/   __/
       \\/       \\/     |__|
`

export const Help = ({ cwd, command }: { cwd: string, command: string }) => {
    if (command.split(" ").length !== 1) return <Error cwd={cwd} help command={command}><p>[Usage] help</p ></Error >
    return <>
        <CommandLine cwd={cwd} />
        <p className="text-ctp-yellow"><span className="text-ctp-green"></span>{command}</p>
        <pre className="leading-none text-[8px] md:text-lg">
            {HELP}
        </pre>
        <p className="text-sm md:text-md">
            Available Commands: quit, gui, clear, help, whoami, cwd/pwd, ls/dir, cat, cd.

        </p>
    </>
}

export const SplashScreen = () => {
    return <>
        <pre className="leading-none text-[8px] md:text-lg">
            {SPLASH}
        </pre>
        <p className="text-sm md:text-md">
            Available Commands: quit, gui, clear, help, whoami, cwd/pwd, ls/dir, cat, cd.
            <br />
            <span className="text-ctp-red">
                if you are uncomfortable with terminals type gui and end this misery.
            </span>
        </p>
    </>
}