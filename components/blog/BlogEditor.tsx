"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold, Italic, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code, ImageIcon, LinkIcon, Undo, Redo, Minus,
} from "lucide-react";

interface BlogEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export function BlogEditor({ content, onChange, placeholder = "Start writing your blog post..." }: BlogEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Image.configure({ inline: false, allowBase64: true }),
            Link.configure({ openOnClick: false, autolink: true }),
            Placeholder.configure({ placeholder }),
        ],
        content,
        onUpdate: ({ editor: e }) => {
            onChange(e.getHTML());
        },
        editorProps: {
            attributes: {
                style: "min-height: 300px; outline: none; padding: 16px; font-size: 15px; line-height: 1.7; color: #1f2937;",
            },
        },
    });

    if (!editor) return null;

    function addImage() {
        const url = window.prompt("Enter image URL:");
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }

    function addLink() {
        const url = window.prompt("Enter URL:");
        if (url && editor) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    }

    const btnStyle = (active: boolean): React.CSSProperties => ({
        padding: "6px",
        borderRadius: 4,
        border: "none",
        background: active ? "#e0e7ff" : "transparent",
        color: active ? "#4338ca" : "#6b7280",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.1s",
    });

    const iconSize = { width: 16, height: 16 };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            <div style={{
                display: "flex", flexWrap: "wrap", gap: 2, padding: "8px 10px",
                borderBottom: "1px solid #e5e7eb", background: "#fafafa",
            }}>
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive("bold"))} title="Bold">
                    <Bold style={iconSize} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive("italic"))} title="Italic">
                    <Italic style={iconSize} />
                </button>
                <div style={{ width: 1, background: "#e5e7eb", margin: "0 4px" }} />
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={btnStyle(editor.isActive("heading", { level: 1 }))} title="Heading 1">
                    <Heading1 style={iconSize} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive("heading", { level: 2 }))} title="Heading 2">
                    <Heading2 style={iconSize} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive("heading", { level: 3 }))} title="Heading 3">
                    <Heading3 style={iconSize} />
                </button>
                <div style={{ width: 1, background: "#e5e7eb", margin: "0 4px" }} />
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive("bulletList"))} title="Bullet List">
                    <List style={iconSize} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive("orderedList"))} title="Ordered List">
                    <ListOrdered style={iconSize} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive("blockquote"))} title="Blockquote">
                    <Quote style={iconSize} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={btnStyle(editor.isActive("codeBlock"))} title="Code Block">
                    <Code style={iconSize} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={btnStyle(false)} title="Horizontal Rule">
                    <Minus style={iconSize} />
                </button>
                <div style={{ width: 1, background: "#e5e7eb", margin: "0 4px" }} />
                <button type="button" onClick={addLink} style={btnStyle(editor.isActive("link"))} title="Add Link">
                    <LinkIcon style={iconSize} />
                </button>
                <button type="button" onClick={addImage} style={btnStyle(false)} title="Add Image">
                    <ImageIcon style={iconSize} />
                </button>
                <div style={{ width: 1, background: "#e5e7eb", margin: "0 4px" }} />
                <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} style={{ ...btnStyle(false), opacity: editor.can().undo() ? 1 : 0.3 }} title="Undo">
                    <Undo style={iconSize} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} style={{ ...btnStyle(false), opacity: editor.can().redo() ? 1 : 0.3 }} title="Redo">
                    <Redo style={iconSize} />
                </button>
            </div>
            <EditorContent editor={editor} />
            <style>{`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .tiptap h1 { font-size: 1.75em; font-weight: 700; margin: 0.67em 0; }
                .tiptap h2 { font-size: 1.4em; font-weight: 600; margin: 0.6em 0; }
                .tiptap h3 { font-size: 1.15em; font-weight: 600; margin: 0.5em 0; }
                .tiptap ul, .tiptap ol { padding-left: 1.5em; margin: 0.5em 0; }
                .tiptap li { margin: 0.2em 0; }
                .tiptap blockquote { border-left: 3px solid #d1d5db; padding-left: 1em; margin: 0.75em 0; color: #6b7280; }
                .tiptap pre { background: #1e1e2e; color: #cdd6f4; padding: 12px 16px; border-radius: 6px; overflow-x: auto; font-size: 13px; margin: 0.75em 0; }
                .tiptap code { background: #f3f4f6; padding: 2px 5px; border-radius: 3px; font-size: 0.9em; }
                .tiptap pre code { background: none; padding: 0; }
                .tiptap img { max-width: 100%; height: auto; border-radius: 6px; margin: 0.75em 0; }
                .tiptap a { color: #2563eb; text-decoration: underline; }
                .tiptap hr { border: none; border-top: 1px solid #e5e7eb; margin: 1em 0; }
                .tiptap p { margin: 0.4em 0; }
            `}</style>
        </div>
    );
}
