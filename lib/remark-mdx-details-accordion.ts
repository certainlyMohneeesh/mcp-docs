import { visit } from "unist-util-visit";

type MdxJsxNode = {
  type: string;
  name?: string;
};

export function remarkMdxDetailsAccordion() {
  return (tree: unknown) => {
    visit(tree, (node: unknown) => {
      const typedNode = node as MdxJsxNode;
      if (
        typedNode.type !== "mdxJsxFlowElement" &&
        typedNode.type !== "mdxJsxTextElement"
      ) {
        return;
      }

      if (typedNode.name === "details") {
        typedNode.name = "MdxDetails";
      }

      if (typedNode.name === "summary") {
        typedNode.name = "MdxSummary";
      }
    });
  };
}
