'use client';

import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

interface EditorProps {
    data?: string;
    onChange: (data: string) => void;
    placeholder?: string;
}

const Editor: React.FC<EditorProps> = ({ data, onChange, placeholder }) => {
    return (
        <div className="suneditor-container prose prose-sm max-w-none">
            <SunEditor
                setContents={data}
                onChange={onChange}
                placeholder={placeholder || "Tulis cerita Anda di sini..."}
                setOptions={{
                    height: '600px',
                    buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['paragraphStyle', 'blockquote'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor', 'textStyle'],
                        ['removeFormat'],
                        '/', // Line break for toolbar
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                        ['table', 'link', 'image', 'video', 'audio'],
                        ['fullScreen', 'showBlocks', 'codeView'],
                        ['preview', 'print'],
                        ['save', 'template']
                    ],
                    font: [
                        'Arial',
                        'Comic Sans MS',
                        'Courier New',
                        'Impact',
                        'Georgia',
                        'tahoma',
                        'Trebuchet MS',
                        'Verdana',
                        'Times New Roman',
                        'Poppins'
                    ],
                    defaultStyle: 'font-family: "Instrument Sans", sans-serif; font-size: 16px;',
                }}
            />
            <style jsx global>{`
                .sun-editor {
                    border-radius: 1rem !important;
                    overflow: hidden !important;
                    border-color: #f3f4f6 !important;
                    font-family: inherit !important;
                }
                .sun-editor .se-toolbar {
                    background-color: #fff !important;
                    outline: 1px solid #f3f4f6 !important;
                }
                .sun-editor .se-resizing-bar {
                    background-color: #f9fafb !important;
                }
                .sun-editor .se-btn-module-border {
                    border-radius: 0.5rem !important;
                    margin: 2px !important;
                }
                .sun-editor-editable {
                    padding: 2rem !important;
                    background-color: #ffffff !important;
                }
            `}</style>
        </div>
    );
};

export default Editor;
