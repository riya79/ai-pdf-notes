"use client"
import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Loader2Icon } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { ingest } from '@/convex/myActions'
import { toast } from 'sonner'

function UploadPdfDialogue({children,isMaxFile}) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry=useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl=useMutation(api.fileStorage.getFileUrl);
  const embedDocument=useAction(api.myActions.ingest);
  const {user}=useUser();
  const [file,setFile] = useState();
  const [loading,setLoading] = useState(false);
  const [fileName,setFileName]= useState();
  const [open,setOpen] = useState(false);
  const OnFileSelect = (event)=>{
     setFile(event.target.files[0]);
  }
  const onUpload = async()=>{
    setLoading(true);
    const postUrl=await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type},
      body: file

    });
    const { storageId } = await result.json();
    console.log(storageId);
    const fileId =uuid4();
    const fileUrl= await getFileUrl({storageId:storageId})
    // Step 3: Save the newly allocated storage id to the database
    const resp = await addFileEntry({
      fileId:fileId,
      storageId:storageId,
      fileName:fileName??'Untitled File',
      fileUrl:fileUrl,
      createdBy:user?.primaryEmailAddress?.emailAddress
    

    })
    // console.log(resp);
    //api call fetch pdf process data
   const ApiResp = await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
   console.log(ApiResp.data.result);
     await embedDocument({
                        splitText:ApiResp.data.result,
                        fileId:fileId
                      });
                      
                      // console.log(embedResult);
   setLoading(false);
   setOpen(false);
   toast('File is ready...');
  }
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={()=>{
             setOpen(true);
        }} 
        disabled={isMaxFile}
         className="w-full"   >
          + Upload Pdf File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Pdf File</DialogTitle>
          <DialogDescription asChild>
           <div className='mt-5'>
           <h2>Select a file to upload</h2>
              <div className='gap-2 p-3'>
                <input type="file" accept="application/pdf,.pdf"
                 onChange={(event)=>OnFileSelect(event)}
                />    
              </div>
              <div className='mt-2'>
                 <label>File Name *</label>
                 <Input placeholder="Enter File Name"
                 onChange={
                  (e)=>setFileName(e.target.value)
                 }
                 />
              </div>
      

           </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={onUpload} disabled={loading}  >
            {loading?
              <Loader2Icon className='animate-spin'/>:'Upload'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default UploadPdfDialogue