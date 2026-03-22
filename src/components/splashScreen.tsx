const SPLASH: string = `  ___ ___         .__  .__                               .__       .___._.
 /   |   \\   ____ |  | |  |   ____   __  _  _____________|  |    __| _/| |
/    ~    \\_/ __ \\|  | |  |  /  _ \\  \\ \\/ \\/ /  _ \\_  __ \\  |   / __ | | |
\\    Y    /\\  ___/|  |_|  |_(  <_> )  \\     (  <_> )  | \\/  |__/ /_/ |  \\|
 \\___|_  /  \\___  >____/____/\\____/    \\/\\_/ \\____/|__|  |____/\\____ |  __
       \\/       \\/                                                  \\/  \\/
`;

export const SplashScreen = ({ commands }: { commands: string[] }) => {
  return (
    <>
      <pre className="leading-none text-[8px] md:text-lg">{SPLASH}</pre>
      <p className="text-sm md:text-md">
        Available Commands: {commands.join(", ")}.
        <br />
        <span className="text-ctp-red">
          if you are uncomfortable with terminals type gui and end this misery.
        </span>
      </p>
    </>
  );
};
