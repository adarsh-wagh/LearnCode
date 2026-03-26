'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CompletedExercises, exercises } from '../../../_components/CourseList';
import ContentSection from './_components/ContentSection';
import CodeEditor from './_components/CodeEditor';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export type CourseExercise = {
 chapterId: number,
 courseID: number,
 desc: string,
 name: string,
 exercises: exercises[],
 exerciseData: ExerciseData,
 completedExercise: CompletedExercises[]
}

export type ExerciseData = {
  courseID: number,
  chapterId: number,
  exerciseId: string,
  exerciseName: string,
  exerciseContent: ExerciseContent
}

export type ExerciseContent = {
  content: string,
  hint: string,
  hintXp: string,
  starterCode: any,
  task: string,
}

function Playground() {

 const {courseID,chapterId,exerciseslug} = useParams(); 
 const [loading,setLoading] = useState(false);

 const [courseExerciseData,setCourseExerciseData] = useState<CourseExercise>();
 const [exerciseInfo,setExerciseInfo] = useState<exercises>();
 const [NextButtonRoute,setNextButtonRoute] = useState<string>();
 const [PrevButtonRoute,setPrevButtonRoute] = useState<string>();

useEffect(()=>{ 
  GetExerciseCourseDetail();
},[])

const GetExerciseCourseDetail = async () => { 
  setLoading(true);

  const result = await axios.post('/api/exercise', {
    courseID: Number(courseID),
    chapterId: Number(chapterId),
    exerciseId: exerciseslug
  })

  setCourseExerciseData(result.data);
  setLoading(false);
}

useEffect(() => { 
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = ''; }
},[])

useEffect(() => {
  if(courseExerciseData){
    const exerciseInfo = courseExerciseData.exercises?.find(
      (item) => item.slug == exerciseslug
    );
    setExerciseInfo(exerciseInfo);

    const currentIndex =
      courseExerciseData.exercises?.findIndex(
        item => item.slug == exerciseslug
      ) ?? -1;

    if(currentIndex !== -1){
      const next = courseExerciseData.exercises[currentIndex + 1]?.slug;
      const prev = courseExerciseData.exercises[currentIndex - 1]?.slug;

      setNextButtonRoute(
        next ? `/courses/${courseID}/${chapterId}/${next}` : undefined
      );

      setPrevButtonRoute(
        prev ? `/courses/${courseID}/${chapterId}/${prev}` : undefined
      );
    }
  }
}, [courseExerciseData])

return (
<div className='border-t-4'>

  <div className="flex h-[calc(100vh-80px)] overflow-hidden">

    {/* LEFT PANEL */}
    <div className="basis-1/3 shrink-0 overflow-auto border-r-2 border-slate-700">
      <ContentSection 
        courseExerciseData={courseExerciseData} 
        loading={loading}
      />
    </div>

    {/* RIGHT PANEL */}
   <div className="basis-2/3 flex overflow-hidden">
      <CodeEditor 
        courseExerciseData={courseExerciseData} 
      />
    </div>

  </div>
      
  {/* FOOTER */}
  <div className="font-game fixed bottom-0 w-full border-t-4 bg-slate-950 flex p-4 justify-between items-center">
     
      <Link href={PrevButtonRoute ?? `/courses/${courseID}`}>
        <Button variant={'pixel'} className="text-xl">Previous</Button>
      </Link>

    <div className='flex gap-2 items-center text-2xl'>
        <Image src="/star.png" alt="star" width={40} height={40} />
        <h2>
          You can earn 
          <span className='text-yellow-400 text-3xl'>
            {exerciseInfo?.xp}
          </span> Xp
        </h2>
    </div>

        <Link href={NextButtonRoute ?? `/courses/${courseID}`}>
          <Button variant={'pixel'} className="text-xl">Next</Button>
        </Link>

  </div>
</div>
);
}

export default Playground;