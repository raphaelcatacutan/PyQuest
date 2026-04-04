import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import * as monaco from 'monaco-editor';
import Button from "../ui/Button";  
import {
  playIcon,
  clearIcon,
} from '@/src/assets'
import { useBeeStore } from "@/src/game/store/useBeeStore";


export default function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { bees, increaseBees } = useBeeStore();

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
    increaseBees();
    console.log('Bees after increment:', bees);
  }

  // TODO: Save changes to File Tree only
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
    const code = editorRef.current?.getValue() 
    alert(code)
    console.log("Run function executed")
  } 

  return (
    <div className="flex flex-col w-full h-full relative bg-[#23100a]">
      <div className="flex flex-row-reverse m-1 gap-2">
        <Button variant="icon-only-btn" icon={clearIcon} iconSize={20} onClick={handleClear} title="Clear editor"/>
        {/* <Button variant="icon-only-btn" icon={saveIcon} iconSize={20} onClick={handleSave} title="Save code"/> */}
        {/* <Button variant="icon-only-btn" icon={openIcon} iconSize={20} onClick={handleOpen} title="Open a file"/> */}
        <Button variant="icon-only-btn" icon={playIcon} iconSize={20} onClick={handleRun} title="Execute code (Ctrl + Enter)"/>
      </div>
      <div className="flex-1 relative">
        <Editor
          
          height="100%"
          defaultLanguage="python"
          defaultValue="# Welcome to PyQuest! 
# Start writing your coding journey in Python here!"
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