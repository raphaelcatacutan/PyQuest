import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  return (
    <div className="w-full h-full">
      <div className="flex flex-row-reverse mb-1 mr-1 gap-1">
        <button></button>
        <button></button>
        <button></button>
      </div>
      <Editor
        defaultLanguage="python"
        defaultValue="# Defeat the slime!\nprint('Hello, world!')"
        theme="vs-dark"
      />
    </div>
  );
}