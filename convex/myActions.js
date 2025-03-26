import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { api } from "./_generated/api.js";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string()
  },
  handler: async (ctx,args ) => {
    // console.log("splitText:", args.splitText); 
    const formattedText = args.splitText.map(item => item.pageContent);
    
    const metadata = formattedText.map(() => ({ fileId: args.fileId }));
    // console.log("Formatted Text:", formattedText);
    await ConvexVectorStore.fromTexts(
      formattedText,
      metadata,
      new GoogleGenerativeAIEmbeddings({
       apiKey:process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    
    );
      return "Completed......"
  },
}); 


export const search = action({
  args: {
    query: v.string(),
    fileId:v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey:process.env.NEXT_PUBLIC_GEMINI_API_KEY,
         model: "text-embedding-004", // 768 dimensions
         taskType: TaskType.RETRIEVAL_DOCUMENT,
         title: "Document title",
       }),
      { ctx });

    const resultOne = await (await vectorStore.similaritySearch(args.query, 1)).filter(q=>q.metadata.fileId==args.fileId)
    console.log(resultOne);
    return JSON.stringify(resultOne);
  },
});