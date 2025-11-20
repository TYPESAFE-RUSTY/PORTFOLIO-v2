import CommandLine from "./commandLine"

export function CommandOutput({ cwd, command, children }: { cwd: string, command: string, children: React.ReactNode }) {
    return (
        <>
            <CommandLine cwd={cwd} />
            <p className="text-ctp-yellow"><span className="text-ctp-green"></span>{command}</p>
            {children}
        </>
    )
}

export const Error = ({ cwd, command, children, help }: { cwd: string, command: string, children: React.ReactNode, help: boolean }) => {
    return <>
        <CommandLine cwd={cwd} />
        <p className="text-ctp-yellow"><span className="text-ctp-red"></span>{command}</p>
        {children}
        {!help && "Type help for more info."}
    </>
}
