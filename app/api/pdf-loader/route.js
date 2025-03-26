import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const pdfUrl="https://adept-hawk-671.convex.cloud/api/storage/fa01f968-bd98-4a2b-bf64-1c34d76a2a79";
export async function GET(req) {
    const reqUrl=req.url;
    const {searchParams}= new URL(reqUrl);
    const pdfUrl = searchParams.get('pdfUrl');
    console.log(pdfUrl);

    //load pdf file
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader= new WebPDFLoader(data);
    const docs= await loader.load();

    let pdfTextContent='';
    docs.forEach(doc=>{
     pdfTextContent=pdfTextContent+doc.pageContent;
    })

// slpit text into small chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 40
  });
  
  const output = await splitter.createDocuments([pdfTextContent]);

 

    return NextResponse.json({result:output})
    
}