"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

function Dashboard() {
  const { user } = useUser();

  // Memoize userEmail to avoid hook order issues
  const userEmail = useMemo(() => user?.primaryEmailAddress?.emailAddress, [user]);

  // Always call useQuery (even if userEmail is undefined)
  const fileList = useQuery(api.fileStorage.UserFiles, userEmail ? { userEmail } : undefined);

  console.log(fileList);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="font-medium text-3xl">Workspace</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-5 mt-10'>
        {fileList?.length>0?fileList?.map((file, index) => (
          <Link href={'/workspace/'+file?.fileId}  key={index}>
          <div
            key={index}
            className="flex p-5 shadow-md rounded-md flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all "
          >
            <Image src={"/pdf.png"} alt="file" width={50} height={50} />
            <h2
            className="mt-3 font-medium text-lg "
            >{file?.fileName}</h2>
          </div>
          </Link>
        )):[1,2,3,4,5,6,7].map((file, index) => (
          <div 
          key={index}
          className='bg-slate-200 rounded-md h-[150px] animate-pulse'>
          </div>
        ))
      }
      </div>
    </div>
  );
}

export default Dashboard;
