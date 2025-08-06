'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import HardBreak from '@tiptap/extension-hard-break';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Inline Styles */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-800 text-white px-3 py-1 rounded' : 'bg-gray-200 px-3 py-1 rounded'}>
        Bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-800 text-white px-3 py-1 rounded' : 'bg-gray-200 px-3 py-1 rounded'}>
        Italic
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-gray-800 text-white px-3 py-1 rounded' : 'bg-gray-200 px-3 py-1 rounded'}>
        Underline
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-gray-800 text-white px-3 py-1 rounded' : 'bg-gray-200 px-3 py-1 rounded'}>
        Strike
      </button>

      {/* Paragraph and Headings */}
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={!editor.isActive('heading') ? 'bg-purple-800 text-white px-3 py-1 rounded' : 'bg-purple-100 px-3 py-1 rounded'}>
        Paragraph
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-purple-700 text-white px-3 py-1 rounded' : 'bg-purple-100 px-3 py-1 rounded'}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-purple-700 text-white px-3 py-1 rounded' : 'bg-purple-100 px-3 py-1 rounded'}>
        H2
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-purple-700 text-white px-3 py-1 rounded' : 'bg-purple-100 px-3 py-1 rounded'}>
        H3
      </button>

      {/* Lists */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-blue-700 text-white px-3 py-1 rounded' : 'bg-blue-100 px-3 py-1 rounded'}>
        Bullet List
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-blue-700 text-white px-3 py-1 rounded' : 'bg-blue-100 px-3 py-1 rounded'}>
        Numbered List
      </button>

      {/* Other Blocks */}
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-gray-800 text-white px-3 py-1 rounded' : 'bg-gray-200 px-3 py-1 rounded'}>
        Quote
      </button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'bg-gray-800 text-white px-3 py-1 rounded' : 'bg-gray-200 px-3 py-1 rounded'}>
        Code
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()} className="bg-yellow-200 px-3 py-1 rounded">
        Line Break
      </button>

      {/* Undo/Redo */}
      <button onClick={() => editor.chain().focus().undo().run()} className="bg-red-100 px-3 py-1 rounded">
        Undo
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className="bg-green-100 px-3 py-1 rounded">
        Redo
      </button>
    </div>
  );
};


const BlogEditor = ({ onChange, value = '' }) => {
  const editor = useEditor({
  extensions: [
    StarterKit.configure({
      paragraph: {
        HTMLAttributes: {
          class: 'mb-2',
        },
      },
    }),
    Underline,
    Link.configure({ openOnClick: false }),
    HardBreak.configure({
      keepMarks: true,
      keepAttributes: true,
    }),
  ],

  content: value || '<p>Start writing your blog...</p>',
  onUpdate({ editor }) {
    const html = editor.getHTML();
    onChange?.(html);
  },
  immediatelyRender: false,
});


  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div className="border border-gray-300 bg-white rounded-md px-5 py-3">
      <MenuBar editor={editor} />
      <EditorContent className='border-none' editor={editor} />
    </div>
  );
};

export default BlogEditor;
