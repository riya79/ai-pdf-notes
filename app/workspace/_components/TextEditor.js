import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import EditorExtensions from './EditorExtensions';
import React, { useEffect } from 'react';
import { useQueries, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function TextEditor({fileId}) {
    const notes=useQuery(api.notes.GetNotes,{
     fileId:fileId
    });
   console.log(notes);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({ levels: [1, 2, 3] }), // Enable H1, H2, H3
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }), // Allow alignment
            Underline, // Add underline extension
            Placeholder.configure({
                placeholder: 'Start Taking Your Notes here...',
            }),
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none h-screen p-5',
            },
        },
    });

  
    useEffect(()=>{
    editor&&editor.commands.setContent(notes)
    },[notes&&editor])

    return (
        <div>
            <EditorExtensions editor={editor} />
            <div
            className='overflow-scroll h-[88vh]'
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export default TextEditor;
