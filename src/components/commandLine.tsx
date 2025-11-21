"use client";

let location = 'typesafe-rusty.github.io';

// below return statements have some glyphs which are rendered only with nerd fonts so ignore wierd text
export default function CommandLine({ cwd }: { cwd: string }) {

    return (
        <div className="text-ctp-mantle">
            <span className=" text-ctp-surface0"></span>
            <span className="bg-ctp-surface0 text-ctp-text">󰍲 GUEST</span>
            <span className="bg-ctp-peach text-ctp-surface0"></span>
            <span className="bg-ctp-peach"> {location} [{cwd.length > 10 ? "…/" + cwd.split('/').pop() : cwd}] </span>
            <span className="bg-ctp-green text-ctp-peach"></span>
            <span className="bg-ctp-green">  main</span>
            <span className="bg-ctp-teal text-ctp-green"></span>
            <span className="bg-ctp-teal">  v24.11.1</span>
            <span className="bg-ctp-pink text-ctp-teal"></span>
            <span className="bg-ctp-pink">  {(new Date().toLocaleString("en-US", { hour: 'numeric', minute: 'numeric', hour12: true }))}</span>
            <span className="text-ctp-pink"></span>
        </div>
    )
}
