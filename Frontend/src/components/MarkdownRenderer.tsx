import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ComponentPropsWithoutRef } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Custom Markdown Renderer with beautiful styling
 * Supports: Headers, Tables, Lists, Code Blocks, Bold, Italic, Links
 */
const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headers
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-foreground mb-4 mt-6 pb-2 border-b-2 border-primary/20">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-foreground mb-3 mt-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-foreground mb-2 mt-3">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-foreground/90 leading-relaxed mb-4">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 marker:text-primary marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/90 flex items-start gap-2">
              <span className="text-primary mt-1.5">•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6 rounded-lg border border-border">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary/50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-secondary/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-foreground/80">
              {children}
            </td>
          ),

          // Code
          code: ({ inline, children, ...props }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => {
            if (inline) {
              return (
                <code 
                  className="px-1.5 py-0.5 bg-secondary text-primary rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code 
                className="block p-4 bg-secondary rounded-lg text-sm font-mono overflow-x-auto mb-4"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-4">
              {children}
            </pre>
          ),

          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-bold text-primary">
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-foreground/90">
              {children}
            </em>
          ),

          // Links
          a: ({ children, href }) => (
            <a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {children}
            </a>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-4 italic text-muted-foreground bg-secondary/30 rounded-r">
              {children}
            </blockquote>
          ),

          // Horizontal Rule
          hr: () => (
            <hr className="my-6 border-t-2 border-border" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;