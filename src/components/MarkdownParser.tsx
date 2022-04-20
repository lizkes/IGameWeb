import ReactMarkdown from "react-markdown";

type Props = {
  children: string;
};

function MarkdownParser({ children }: Props) {
  return <ReactMarkdown>{children}</ReactMarkdown>;
}

export default MarkdownParser;
