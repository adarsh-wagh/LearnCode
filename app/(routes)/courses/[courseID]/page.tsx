"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseDetailBanner from './_components/CourseDetailBanner';
import axios from 'axios';
import { Course } from '../_components/CourseList';
import CourseChapters from './_components/CourseChapters';
import CourseStatus from './_components/CourseStatus';
import UpgradeToPro from '../../dashboard/_components/UpgradeToPro';
import CommunityHelpSection from './_components/CommunityHelpSection';

function CourseDetail() {

  const params = useParams();
  const courseID = params?.courseID as string;

  const [courseDetail, setCourseDetail] = useState<Course>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  courseID && GetCourseDetail();
    },[courseID])

  const GetCourseDetail = async () => {
    setLoading(true);
    const result = await axios.get(`/api/course?courseID=${courseID}`);
    console.log(result.data);
    setCourseDetail(result?.data);
    setLoading(false);

  };

  return (
    <div>
      <CourseDetailBanner 
        loading={loading}
        courseDetail={courseDetail}
        refreshData={()=>GetCourseDetail()}
      />
      <div className='grid grid-cols-3 p-10 md:px-24 lg:p-36 gap-7'>

        <div className='col-span-2'>
          <CourseChapters
            loading={loading}
            courseDetail={courseDetail}
        />
        </div>

        <div>

          <CourseStatus courseDetail={courseDetail}/>
          <UpgradeToPro/>
          <CommunityHelpSection/>

        </div>

      </div>
    </div>
  );
}

export default CourseDetail;