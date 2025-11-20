import CommandLine from "./commandLine"

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
    return <>
        <CommandLine cwd={cwd} />
        <p className="text-ctp-yellow"><span className="text-ctp-green"></span>{command}</p>
        <pre className="leading-none">
            {HELP}
        </pre>
        <p>
            Available Commands: ls, cwd/pwd, cat, clear, help, quit, gui.
        </p>
    </>
}

export const SplashScreen = () => {
    return <>
        <pre className="leading-none">
            {SPLASH}
        </pre>
        <p>
            Available Commands: ls, cwd/pwd, cat, clear, help, quit, gui.
        </p>
    </>
}