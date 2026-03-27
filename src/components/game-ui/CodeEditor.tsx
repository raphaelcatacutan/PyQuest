import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import * as monaco from 'monaco-editor'; 

export default function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, _monaco) => {
    editorRef.current = editor;
  };

  function handleClear() {
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  }

  function handleSave() {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "code.py";
      a.click();

      URL.revokeObjectURL(url);
    }
  }

  function handleOpen() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".py,.txt";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (editorRef.current && typeof content === "string") {
          editorRef.current.setValue(content);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row-reverse mb-1 mr-1 gap-1">
        <button onClick={handleClear} className="p-2 bg-red-500 text-white"></button>
        <button onClick={handleSave} className="p-2 bg-blue-500 text-white"></button>
        <button onClick={handleOpen} className="p-2 bg-green-500 text-white"></button>
      </div>
      <Editor
        height="90vh"
        defaultLanguage="python"
        defaultValue="# Defeat the slime!\nprint('Hello, world!')"
        theme="vs-dark"
        /* 3. YOU MUST PASS THE HANDLER HERE */
        onMount={handleEditorDidMount}
      />
    </div>
  );
}