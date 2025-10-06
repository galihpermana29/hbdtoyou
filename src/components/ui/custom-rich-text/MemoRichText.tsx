'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';
import {
  List,

} from 'lucide-react';

interface MemoRichTextProps {
  defaultContent?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const MemoRichText = ({
  defaultContent,
  value,
  onChange,
}: MemoRichTextProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || defaultContent || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // Sync external value changes with editor content
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Set initial value when editor is ready and no external value is provided
  useEffect(() => {
    if (editor && !value && defaultContent && editor.getHTML() === '<p></p>') {
      editor.commands.setContent(defaultContent);
      onChange?.(defaultContent);
    }
  }, [editor, defaultContent, value, onChange]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Add custom styles for TipTap */}
      <style jsx>{`
        .ProseMirror ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          padding-left: 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          padding-left: 0;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
      `}</style>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''
            }`}
          type="button">
          <List size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="p-3 overflow-y-auto h-[200px] bg-white rounded-b-md border border-t-0 border-gray-200">
        <EditorContent
          editor={editor}
          className="focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_em]:italic [&_.ProseMirror_strong]:font-bold"
        />
      </div>
    </div>
  );
};

export default MemoRichText;
