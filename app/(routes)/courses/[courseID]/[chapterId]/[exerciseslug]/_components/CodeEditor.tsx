'use client'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import React, { useState } from 'react'
import SplitterLayout from 'react-splitter-layout';
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
  loading: boolean
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

function CodeEditor({ courseExerciseData, loading }: Props) {

  const { exerciseslug } = useParams();
  const [completed, setCompleted] = useState(false);

  const exerciseIndex =
    courseExerciseData?.exercises?.findIndex(item => item.slug == exerciseslug);

  const alreadyCompleted =
    courseExerciseData?.completedExercise?.find(
      item => item?.exerciseId == Number(exerciseIndex) + 1
    );

  const IsCompleted = completed || alreadyCompleted;

  const onCompleteExercise = async () => {

    if (exerciseIndex == undefined) return;

    const result = await axios.post('/api/exercise/complete', {
      courseID: courseExerciseData?.courseID,
      chapterId: courseExerciseData?.chapterId,
      exerciseId: exerciseIndex + 1,
      xpEarned: courseExerciseData?.exercises[exerciseIndex].xp,
    });

    console.log(result);

    setCompleted(true); // update UI immediately

    toast.success('Exercise completed!');
  };

  return (
    <div>

      <SandpackProvider
        template="static"
        theme={sandpackTheme}
        style={{ height: '100vh' }}
        files={courseExerciseData?.exerciseData?.exerciseContent?.starterCode}
        options={{
          autorun: false,
          autoReload: false,
        }}
      >

        <SandpackLayout style={{ height: '100%' }}>

          <SplitterLayout
            percentage
            primaryMinSize={30}
            secondaryMinSize={30}
            secondaryInitialSize={50}
          >

            <div className="relative h-full">
              <SandpackCodeEditor
                showRunButton={false}
                showLineNumbers
                showTabs
                style={{ height: '100%' }}
              />

              <CodeEditorChildren
                onCompleteExercise={onCompleteExercise}
                IsCompleted={IsCompleted}
              />
            </div>

            <SandpackPreview
              showOpenNewtab
              showNavigator
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              style={{ height: '100%' }}
            />

          </SplitterLayout>

        </SandpackLayout>

      </SandpackProvider>

    </div>
  )
}

export default CodeEditor