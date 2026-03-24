"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import axios from "axios";
import { Course } from "../(routes)/courses/_components/CourseList";

function Header() {
  const { user } = useUser();
  const { exerciseslug } = useParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    GetCourses();
  }, []);

  const GetCourses = async () => {
  try {
    const result = await axios.get("/api/course");

    const data = Array.isArray(result.data)
      ? result.data
      : result.data?.courses || [];

    setCourses(data);
  } catch (error) {
    console.error(error);
    setCourses([]);
  }
};

  if (!mounted) return null;

  return (
    <div className="p-4 max-w-7xl flex justify-between items-center w-full">
      
     <Link  href={'/'}> 
      <div className="flex gap-2 items-center">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <h2 className="font-bold text-3xl font-game">LearnCode</h2>
      </div>
      </Link>

      {!exerciseslug ? (
        <NavigationMenu>
          <NavigationMenuList className="gap-8">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid md:grid-cols-2 gap-2 sm:w-[400px] md:w-[500px] lg:w-[600px]">
                {Array.isArray(courses) &&
                  courses.map((course, index) => (
                    <Link key={index} href={"/courses/" + course?.courseID}>
                      <div className="p-2 hover:bg-accent rounded-xl cursor-pointer">
                        <h2 className="font-medium">{course?.title}</h2>
                        <p className="text-sm text-gray-500">{course?.desc}</p>
                      </div>
                    </Link>
                  ))}
              </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/projects">Projects</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/pricing">Pricing</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact">Contact Us</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ) : (
        <h2 className="text-2xl font-game">
          {exerciseslug?.toString()?.replaceAll("-", " ").toUpperCase()}
        </h2>
      )}

      {!user ? (
        <Link href="/sign-in">
          <Button className="font-game !text-2xl" variant="pixel">
            Signup
          </Button>
        </Link>
      ) : (
        <div className="flex gap-4 items-center">
          <Link href="/dashboard">
            <Button className="font-game !text-2xl" variant="pixel">
              Dashboard
            </Button>
          </Link>
          <UserButton />
        </div>
      )}
    </div>
  );
}

export default Header;