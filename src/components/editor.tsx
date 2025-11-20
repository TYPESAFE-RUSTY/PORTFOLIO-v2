"use client"
import { useEffect, useRef, useState } from "react";

// for code mirror.
import { EditorState, StateEffect } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint'
import { defaultKeymap } from '@codemirror/commands';
import { catppuccinFrappe, catppuccinLatte } from "@catppuccin/codemirror";
import { autocompletion } from "@codemirror/autocomplete";

const baseExtensions = [
    keymap.of(defaultKeymap),
    json(),
    linter(jsonParseLinter()),
    autocompletion(),
    lineNumbers(),
    highlightActiveLine(),
]


export default function Editor({ content }: { content: string }) {
    const [code, setCode] = useState<string>(content);
    const CodeRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView>(null);

    useEffect(() => {
        if (!viewRef.current) return;

        viewRef.current.dispatch({
            changes: {
                from: 0,
                to: viewRef.current.state.doc.length,
                insert: content
            }
        })

    }, [content])

    const onUpdate = EditorView.updateListener.of((v) => {
        setCode(v.state.doc.toString());
    });

    // initalize and add code mirror.
    useEffect(() => {
        if (!CodeRef.current) return;

        // media query for dark mode.
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const isDark = mediaQuery.matches;

        const theme = isDark ? catppuccinFrappe : catppuccinLatte;
        const setupExtensions = [
            ...baseExtensions,
            theme,
            onUpdate
        ]

        // create the actual codemirror state.
        const startState = EditorState.create({
            doc: code,
            extensions: setupExtensions
        });
        // create view.
        const view = new EditorView({ state: startState, parent: CodeRef.current });
        viewRef.current = view;

        const handleColorSchemeChange = (e: MediaQueryListEvent) => {
            const isNowDark = e.matches;
            const theme = isNowDark ? catppuccinFrappe : catppuccinLatte;

            console.log(`Switching editor theme to: ${isNowDark ? 'Frappé (Dark)' : 'Latte (Light)'}`);

            // Dispatch the reconfigure effect
            view.dispatch({
                effects: StateEffect.reconfigure.of([
                    ...baseExtensions,
                    onUpdate,
                    theme,
                ]),
            });
        };

        // 4. Attach the listener
        mediaQuery.addEventListener('change', handleColorSchemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleColorSchemeChange);
            view.destroy();
        };
    }, [])


    return (
        <div ref={CodeRef} className="min-w-full h-full bg-ctp-base">
        </div>
    );
}