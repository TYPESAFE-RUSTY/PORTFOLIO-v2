import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CatppuccinMarkdown = ({ children }: { children: string }) => {
  return (
    <div
      className="text-base leading-7 text-ctp-text selection:bg-ctp-surface2 max-w-4xl py-2 px-1"
      style={{ fontFamily: "var(--font-nerd-font-mono, monospace)" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // H1: Large, bold, with a distinct bottom border
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b-2 border-ctp-surface1 text-ctp-text">
              {children}
            </h1>
          ),

          // H2: Slightly smaller, thinner bottom border
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-8 mb-4 pb-1 border-b border-ctp-surface0 text-ctp-text">
              {children}
            </h2>
          ),

          // H3: Clean and bold
          h3: ({ children }) => (
            <h3 className="text-xl font-bold mt-6 mb-3 text-ctp-text">
              {children}
            </h3>
          ),

          // Paragraphs: High readability line-height
          p: ({ children }) => (
            <p className="mb-4 text-ctp-subtext1">{children}</p>
          ),

          // Blockquote: Zed uses a thick left border and slightly dimmed text
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-ctp-surface2 pl-4 text-ctp-subtext0 italic my-5 bg-ctp-mantle/30 py-1 pr-4 rounded-r-md">
              {children}
            </blockquote>
          ),

          // Lists: Standard editor bullets and numbers
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-5 space-y-1 text-ctp-subtext1 marker:text-ctp-surface2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-5 space-y-1 text-ctp-subtext1 marker:text-ctp-surface2">
              {children}
            </ol>
          ),

          // List Items & Task Lists
          li: ({ children, className }) => {
            const isTask = className?.includes("task-list-item");
            return (
              <li
                className={
                  isTask ? "list-none flex items-center gap-3 -ml-6" : "pl-1"
                }
              >
                {children}
              </li>
            );
          },

          // Checkboxes: Styled like native UI checkboxes themed with Catppuccin
          input: ({ type, checked }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="w-4 h-4 mt-1 rounded-sm border-ctp-surface2 bg-ctp-mantle text-ctp-mauve focus:ring-ctp-mauve accent-ctp-mauve"
                />
              );
            }
            return <input type={type} checked={checked} readOnly />;
          },

          // Tables: Rounded outer borders, clean inner borders, distinct header background
          table: ({ children }) => (
            <div className="my-6 overflow-hidden rounded-lg border border-ctp-surface1 w-max min-w-full">
              <table className="w-full text-left border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-ctp-surface0/50 text-ctp-text">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold border-b border-ctp-surface1">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border-b border-ctp-surface0/50 text-ctp-subtext1">
              {children}
            </td>
          ),

          // Code: Rounded blocks with language headers (Very Zed-like)
          code: ({ inline, children, className }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            return inline ? (
              // Inline Code: subtle background, tinted text
              <code className="bg-ctp-surface0/60 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono text-ctp-rosewater">
                {children}
              </code>
            ) : (
              // Block Code
              <div className="my-5 rounded-lg overflow-hidden border border-ctp-surface0 bg-ctp-mantle shadow-sm w-full">
                {match && (
                  <div className="flex items-center px-4 py-2 bg-ctp-crust text-xs text-ctp-subtext0 border-b border-ctp-surface0 select-none uppercase tracking-wider font-semibold">
                    {match[1]}
                  </div>
                )}
                <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                  <code className="text-ctp-text">{children}</code>
                </pre>
              </div>
            );
          },

          // Links: Simple, clean underlines
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ctp-blue hover:text-ctp-sky underline underline-offset-4 decoration-ctp-blue/40 hover:decoration-ctp-sky transition-colors"
            >
              {children}
            </a>
          ),

          // Images: Rounded corners with a slight border
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg my-6 border border-ctp-surface0 shadow-sm"
            />
          ),

          // Horizontal Rule: Solid line
          hr: () => <hr className="my-8 border-t-2 border-ctp-surface0" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default CatppuccinMarkdown;
