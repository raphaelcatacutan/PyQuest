import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import * as monaco from 'monaco-editor';
import Button from "../ui/Button";  
import playIcon from "@/public/assets/icons/play.svg?url"
import clearIcon from "@/public/assets/icons/clear.svg?url"
import saveIcon from "@/public/assets/icons/save.svg?url"
import openIcon from "@/public/assets/icons/open.svg?url"

export default function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleEditorDidMount: OnMount = (editor, _monaco) => {
    editorRef.current = editor;

    editor.addCommand(_monaco.KeyMod.CtrlCmd | _monaco.KeyCode.Enter, () => {
      handleRun();
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  function handleRun() {
    // TODO: Bind Python Run
    console.log("Run function executed")
  } 


  return (
    <div className="flex flex-col w-full h-full relative border-1 bg-gray-700">
      <div className="flex flex-row-reverse m-1 gap-2 border-1">
        <Button icon={clearIcon} iconSize={20} onClick={handleClear} title="Clear editor"/>
        <Button icon={saveIcon} iconSize={20} onClick={handleSave} title="Save code"/>
        <Button icon={openIcon} iconSize={20} onClick={handleOpen} title="Open a file"/>
        <Button icon={playIcon} iconSize={20} onClick={handleRun} title="Execute code (Ctrl + Enter)"/>
      </div>
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="python"
          defaultValue="# Defeat the slime!\nprint('Hello, world!')"
          theme="vs-dark"
          onMount={handleEditorDidMount}
        />

        {/* {isDragging && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-400 pointer-events-none flex items-center justify-center">
            <span className="text-white font-semibold">Drop file to insert filename</span>
          </div>
        )} */}
      </div>
    </div>
  );
}