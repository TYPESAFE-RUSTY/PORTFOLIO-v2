import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CatppuccinMarkdown = ({ children }: { children: string }) => {
  return (
    <div
      className="text-sm sm:text-[15px] leading-6 text-ctp-text selection:bg-ctp-surface2 max-w-3xl py-2 px-4 sm:px-2 w-full break-words"
      style={{ fontFamily: "var(--font-nerd-font-mono, monospace)" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold mt-6 mb-3 pb-1.5 border-b border-ctp-surface1">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold mt-6 mb-3 pb-1 border-b border-ctp-surface0">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold mt-5 mb-2">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-3 text-ctp-subtext1 leading-6">{children}</p>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-ctp-surface2 pl-3 text-ctp-subtext0 italic my-4 bg-ctp-mantle/30 py-2 pr-3 rounded-r-md">
              {children}
            </blockquote>
          ),

          ul: ({ children }) => (
            <ul className="list-disc ml-5 mb-4 space-y-1 text-ctp-subtext1 marker:text-ctp-surface2">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal ml-5 mb-4 space-y-1 text-ctp-subtext1 marker:text-ctp-surface2">
              {children}
            </ol>
          ),

          li: ({ children, className }) => {
            const isTask = className?.includes("task-list-item");
            return (
              <li
                className={
                  isTask
                    ? "list-none flex items-start gap-2 -ml-5 text-sm"
                    : "pl-1"
                }
              >
                {children}
              </li>
            );
          },

          input: ({ type, checked }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="w-4 h-4 mt-1 shrink-0 rounded-sm border-ctp-surface2 bg-ctp-mantle text-ctp-mauve accent-ctp-mauve"
                />
              );
            }
            return <input type={type} checked={checked} readOnly />;
          },

          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-lg border border-ctp-surface1 w-full">
              <table className="w-full text-left border-collapse text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-ctp-surface0/50">{children}</thead>
          ),

          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold border-b border-ctp-surface1">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-3 py-2 border-b border-ctp-surface0/50 text-ctp-subtext1">
              {children}
            </td>
          ),

          code: ({ inline, children, className }: any) => {
            const match = /language-(\w+)/.exec(className || "");

            return inline ? (
              <code className="bg-ctp-surface0/60 px-1.5 py-0.5 rounded text-[0.8em] font-mono text-ctp-rosewater">
                {children}
              </code>
            ) : (
              <div className="my-4 rounded-lg overflow-hidden border border-ctp-surface0 bg-ctp-mantle w-full">
                {match && (
                  <div className="px-3 py-1.5 bg-ctp-crust text-[10px] text-ctp-subtext0 border-b border-ctp-surface0 uppercase tracking-wide font-semibold">
                    {match[1]}
                  </div>
                )}
                <pre className="p-3 overflow-x-auto text-xs sm:text-sm font-mono leading-6">
                  <code className="text-ctp-text">{children}</code>
                </pre>
              </div>
            );
          },

          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ctp-blue hover:text-ctp-sky underline underline-offset-2 decoration-ctp-blue/40 hover:decoration-ctp-sky transition-colors break-words"
            >
              {children}
            </a>
          ),

          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg my-5 border border-ctp-surface0"
            />
          ),

          hr: () => <hr className="my-6 border-t border-ctp-surface0" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default CatppuccinMarkdown;
