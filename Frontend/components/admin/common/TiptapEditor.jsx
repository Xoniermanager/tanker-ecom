'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '<p>Write your blog content here...</p>',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[150px]',
      },
    },
    autofocus: false,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
    injectCSS: true,
    // ✅ This prevents hydration mismatch errors
    // ⚠️ Tiptap v2 will throw an SSR warning unless this is explicitly set
    immediatelyRender: false,
  });

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div className="border border-gray-300 bg-white rounded-md px-5 py-3 min-h-[200px]">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;

