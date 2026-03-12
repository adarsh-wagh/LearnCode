'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { exercises } from '../../../_components/CourseList';
import ContentSection from './_components/ContentSection';

export type CourseExercise = {
 chapterId: number,
 courseID: number,
 desc: string,
 name: string,
 exercises: exercises[],
 exerciseData:ExerciseData


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

useEffect(()=>{ 
  GetExerciseCourseDetail();
 },[])

const GetExerciseCourseDetail=async() => { setLoading(true);
const result = await axios.post('/api/exercise', {
  courseID: Number(courseID),
  chapterId: Number(chapterId),
  exerciseId: exerciseslug
})
      console.log(result.data);
      setCourseExerciseData(result.data);
      setLoading(false);
    }

  return (
    <div className='border-t-4'>
      <SplitterLayout percentage 
      primaryMinSize={40} 
      secondaryMinSize={60}>
        
        <div>
          <ContentSection courseExerciseData={courseExerciseData} 
          loading={loading}
          />
        </div>
        <div>Code Editor</div>
      </SplitterLayout>
    </div>
  );
}

export default Playground;
