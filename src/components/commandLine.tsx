"use client";

let location = "typesafe-rusty.github.io";

export default function CommandLine({
  userName,
  cwd,
}: {
  userName: string;
  cwd: string;
}) {
  const shortCwd = cwd.length > 10 ? "…/" + cwd.split("/").pop() : cwd;

  return (
    <>
      {/* Mobile */}
      <div className="text-ctp-green block md:hidden">[{shortCwd}]</div>

      {/* Tablet (md) */}
      <div className="text-ctp-mantle hidden md:block lg:hidden">
        <span className=" text-ctp-surface0"></span>

        <span className="bg-ctp-surface0 text-ctp-text">󰍲 {userName}</span>

        <span className="bg-ctp-peach text-ctp-surface0"></span>

        <span className="bg-ctp-peach"> [{shortCwd}] </span>

        <span className="bg-ctp-pink text-ctp-peach"></span>

        <span className="bg-ctp-pink">
          {" "}
          {" "}
          {new Date().toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </span>

        <span className="text-ctp-pink"></span>
      </div>

      {/* 💻 Desktop (unchanged) */}
      <div className="text-ctp-mantle hidden lg:block">
        <span className=" text-ctp-surface0"></span>
        <span className="bg-ctp-surface0 text-ctp-text">󰍲 {userName}</span>
        <span className="bg-ctp-peach text-ctp-surface0"></span>
        <span className="bg-ctp-peach">
          {" "}
          {location} [{shortCwd}]{" "}
        </span>
        <span className="bg-ctp-green text-ctp-peach"></span>
        <span className="bg-ctp-green">  main</span>
        <span className="bg-ctp-teal text-ctp-green"></span>
        <span className="bg-ctp-teal">  v24.11.1</span>
        <span className="bg-ctp-pink text-ctp-teal"></span>
        <span className="bg-ctp-pink">
          {" "}
          {" "}
          {new Date().toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </span>
        <span className="text-ctp-pink"></span>
      </div>
    </>
  );
}
