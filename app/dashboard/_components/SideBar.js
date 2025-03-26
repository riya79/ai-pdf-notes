"use client"
import React, { useMemo } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Layout, Shield } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import UploadPdfDialogue from './UploadPdfDialogue'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { GetUserInfo } from '@/convex/user'

function SideBar() {
    const { user } = useUser();
    const path = usePathname();
    const getUserInfo = useQuery(api.user.GetUserInfo,{
        userEmail:user?.primaryEmailAddress?.emailAddress
    });
    // Memoize userEmail to avoid hook order issues
    // console.log("hello");
    // console.log("getUserInfo", getUserInfo); 
   
    
    const userEmail = useMemo(() => user?.primaryEmailAddress?.emailAddress, [user]);
  
    // Always call useQuery (even if userEmail is undefined)
    const fileList = useQuery(api.fileStorage.UserFiles, userEmail ? { userEmail } : undefined);
  
  return (
    <div className='shadow-sm h-screen p-5'>
       
        <Image src={'./logo.svg'} alt='logo' width={200} height={200}/>
        <div className='mt-7'>
            <UploadPdfDialogue isMaxFile={fileList?.length>5&&!getUserInfo.upgrade?true:false}
            >
                <Button className={"w-full"}>+Upload Pdf</Button>
            </UploadPdfDialogue>
            <Link href="/dashboard"
            >
            <div className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor
                ${path=='/dashboard'&&'bg-slate-200'}
                `}>
                <Layout/> 
                <h2>Workspace</h2>
            </div>
            </Link>
            <Link href="/dashboard/upgrade"
            >
            <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor
                   ${path=='/dashboard/upgrade'&&' bg-slate-200'}
                `}>
                <Shield/> 
                <h2>Upgrade</h2>
            </div>
            </Link>
            
        </div>
       {!GetUserInfo?.upgrade&&<div className='absolute bottom-24 w-[80%]'>
            <Progress value={
                (fileList?.length/5)*100
            }/>
            <p className='text-sm mt-1'>{fileList?.length} out of 5 Pdf Uploaded</p>
            <p className='text-xs text-gray-400 mt-2'>Upgrade to Upload more Pdf</p>
        </div>}

    </div>
  )
}

export default SideBar