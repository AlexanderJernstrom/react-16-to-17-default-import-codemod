import { API, FileInfo } from "jscodeshift";

const log = (p) => {
  console.log(p.node);
  return true;
};

module.exports = function (fileInfo: FileInfo, api: API, options) {
  const root = api.jscodeshift(fileInfo.source);
  const j = api.jscodeshift;
  if (fileInfo.source.includes("React.")) {
    return root.toSource();
  }
  root
    .find(j.ImportDeclaration, { source: { value: "react" } })
    .replaceWith((p) => {
      const hasDefaultImportReact = p.node?.specifiers?.some(
        (specifier) => specifier.type === "ImportDefaultSpecifier"
      );
      if (!hasDefaultImportReact) return p.node;
      const specifiersWithoutReact = p.node?.specifiers?.filter(
        (specifier) => specifier.type !== "ImportDefaultSpecifier"
      );
      if (specifiersWithoutReact.length === 0) return null;
      return { ...p.node, specifiers: specifiersWithoutReact };
    });

  return root.toSource();
};
