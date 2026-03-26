'use client'
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import React, { useState, useRef, useEffect } from 'react';
import { CourseExercise } from "../page";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const sandpackTheme = {
  colors: {
    surface1: "#0f172b",
    surface2: "#020618",
    surface3: "#1d293d",
    clickable: "#fdc700",
    base: "#90a1b9",
    disabled: "#62748e",
    hover: "#0e172b",
    accent: "#ffffff",
    error: "#ff453a",
    errorSurface: "#ffeceb",
  },
  syntax: {
    plain: "#ffffff",
    comment: { color: "#0088ff", fontStyle: "italic" as const },
    keyword: "#ff9d00",
    tag: "#9effff",
    punctuation: "#e1efff",
    definition: "#ffc600",
    property: "#ffc600",
    static: "#ffee80",
    string: "#a5ff90",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: '"Operator Mono", "Fira Mono", Menlo, Consolas, monospace',
    size: "15px",
    lineHeight: "20px",
  },
};

type Props = {
  courseExerciseData: CourseExercise | undefined,
}

const CodeEditorChildren = ({ onCompleteExercise, IsCompleted }: any) => {
  const { sandpack } = useSandpack();

  return (
    <div className="font-game absolute bottom-40 right-5 flex gap-5">
      <Button
        variant={'pixel'}
        size={'lg'}
        className="text-xl"
        onClick={() => sandpack.runSandpack()}
      >
        Run Code
      </Button>

      <Button
        variant={'pixel'}
        size={'lg'}
        disabled={IsCompleted}
        className="bg-[#a3e534] text-xl"
        onClick={onCompleteExercise}
      >
        {IsCompleted ? "Already Completed" : "Complete"}
      </Button>
    </div>
  )
}

function CodeEditor({ courseExerciseData }: Props) {

  const { exerciseslug } = useParams();
  const [completed, setCompleted] = useState(false);

  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);

  const exerciseIndex =
    courseExerciseData?.exercises?.findIndex(item => item.slug == exerciseslug);

  const alreadyCompleted =
    courseExerciseData?.completedExercise?.find(
      item => item?.exerciseId == Number(exerciseIndex) + 1
    );

  const IsCompleted = completed || alreadyCompleted;

  const onCompleteExercise = async () => {
    if (exerciseIndex == undefined) return;

    await axios.post('/api/exercise/complete', {
      courseID: courseExerciseData?.courseID,
      chapterId: courseExerciseData?.chapterId,
      exerciseId: exerciseIndex + 1,
      xpEarned: courseExerciseData?.exercises[exerciseIndex].xp,
    });

    setCompleted(true);
    toast.success('Exercise completed!');
  };

  // DRAG
  const handleMouseDown = () => (isDragging.current = true);
  const handleMouseUp = () => (isDragging.current = false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const container = document.getElementById("editor-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;

    if (percent > 20 && percent < 80) {
      setLeftWidth(percent);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="h-full w-full min-w-0">

      <SandpackProvider
        template="static"
        theme={sandpackTheme}
        style={{ height: '100%' }}
        files={courseExerciseData?.exerciseData?.exerciseContent?.starterCode}
        options={{
          autorun: false,
          autoReload: false,
        }}
      >

        {/* 🚀 REMOVED SandpackLayout (fixes gap) */}

        <div
          id="editor-container"
          className="flex h-full w-full overflow-hidden min-w-0"
        >

          {/* EDITOR */}
          <div
            style={{ flexBasis: `${leftWidth}%` }}
            className="min-w-0 overflow-auto border-r-2 border-slate-700 relative"
          >
            <SandpackCodeEditor
              showRunButton={false}
              showLineNumbers
              showTabs
              style={{ height: '100%', width: '100%' }}
            />

            <CodeEditorChildren
              onCompleteExercise={onCompleteExercise}
              IsCompleted={IsCompleted}
            />
          </div>

          {/* HANDLE */}
          <div
            onMouseDown={handleMouseDown}
            className="w-2 cursor-col-resize bg-slate-700 hover:bg-slate-500"
          />

          {/* PREVIEW */}
          <div
            style={{ flexBasis: `${100 - leftWidth}%` }}
            className="min-w-0 overflow-auto flex"
          >
            <SandpackPreview
              showOpenNewtab
              showNavigator
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              style={{ height: '100%', width: '100%' }}
            />
          </div>

        </div>

      </SandpackProvider>

    </div>
  )
}

export default CodeEditor;