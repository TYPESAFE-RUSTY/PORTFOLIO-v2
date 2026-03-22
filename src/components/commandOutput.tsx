import CommandLine from "./commandLine";

export function CommandOutput({
  userName,
  cwd,
  command,
  children,
}: {
  userName: string;
  cwd: string;
  command: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <CommandLine userName={userName} cwd={cwd} />
      <p className="text-ctp-yellow">
        <span className="text-ctp-green"></span>
        {command}
      </p>
      {children}
    </>
  );
}

export const Error = ({
  userName,
  cwd,
  command,
  children,
  help = false,
}: {
  userName: string;
  cwd: string;
  command: string;
  children: React.ReactNode;
  help: boolean;
}) => {
  return (
    <>
      <CommandLine userName={userName} cwd={cwd} />
      <p className="text-ctp-yellow">
        <span className="text-ctp-red"></span>
        {command}
      </p>
      {children}
      {help && "Type help for more info."}
    </>
  );
};
