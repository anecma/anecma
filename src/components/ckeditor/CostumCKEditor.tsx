// src/components/CustomCKEditor.tsx

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  CloudServices,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  SelectAll,
  ShowBlocks,
  SourceEditing,
  SpecialCharacters,
  Style,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import translations from "ckeditor5/translations/id.js";
import "ckeditor5/ckeditor5.css";
import "../../app/CustomCKEditor.css";

import {
  FileLoader,
  UploadAdapter,
  UploadResponse,
} from "@ckeditor/ckeditor5-upload";
import axiosInstance from "@/libs/axios";

interface CustomCKEditorProps {
  data: string;
  onChange: (data: string) => void;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

class MyCustomUploadAdapter implements UploadAdapter {
  loader: FileLoader;
  editor: any;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;

  constructor(
    loader: FileLoader,
    editor: any,
    setImages: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    this.loader = loader;
    this.editor = editor;
    this.setImages = setImages;
  }

  upload(): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      this.loader.file.then((file: File | null) => {
        if (!file) return reject(new Error("File is null"));

        const data = new FormData();
        data.append("file", file);

        axiosInstance
          .post("/admin/upload-single-image", data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              const imageUrl = response.data.data;
              this.setImages((prevImages) => [...prevImages, imageUrl]);
              resolve({ default: imageUrl });

              // Insert the image into the editor content
              this.editor.model.change((writer: any) => {
                const imageElement = writer.createElement("imageBlock", {
                  src: imageUrl,
                });
                this.editor.model.insertContent(
                  imageElement,
                  this.editor.model.document.selection
                );
              });
            } else {
              reject(new Error(response.data.message));
            }
          })
          .catch(() => {
            reject(new Error("Error uploading image"));
          });
      });
    });
  }

  abort(): void {}
}

const CustomCKEditor: React.FC<CustomCKEditorProps> = ({
  data,
  onChange,
  setImages,
}) => {
  return (
    <div className="ckeditor-container">
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={(event, editor) => {
          const content = editor.getData();
          onChange(content);
        }}
        config={{
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "sourceEditing",
              "showBlocks",
              "|",
              "heading",
              "style",
              "|",
              "fontSize",
              "fontFamily",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "bold",
              "italic",
              "underline",
              "|",
              "specialCharacters",
              "link",
              "mediaEmbed",
              "insertTable",
              "highlight",
              "blockQuote",
              "|",
              "alignment",
              "|",
              "bulletedList",
              "numberedList",
              "todoList",
              "outdent",
              "indent",
            ],
            shouldNotGroupWhenFull: false,
          },
          plugins: [
            AccessibilityHelp,
            Alignment,
            Autoformat,
            AutoImage,
            Autosave,
            BlockQuote,
            Bold,
            CloudServices,
            Essentials,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            GeneralHtmlSupport,
            Heading,
            Highlight,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            Paragraph,
            PasteFromOffice,
            SelectAll,
            ShowBlocks,
            SourceEditing,
            SpecialCharacters,
            Style,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            TodoList,
            Underline,
            Undo,
          ],
          fontFamily: {
            supportAllValues: true,
          },
          fontSize: {
            options: [10, 12, 14, "default", 18, 20, 22],
            supportAllValues: true,
          },
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
              {
                model: "heading5",
                view: "h5",
                title: "Heading 5",
                class: "ck-heading_heading5",
              },
              {
                model: "heading6",
                view: "h6",
                title: "Heading 6",
                class: "ck-heading_heading6",
              },
            ],
          },
          htmlSupport: {
            allow: [
              {
                name: /^.*$/,
                styles: true,
                attributes: true,
                classes: true,
              },
            ],
          },
          image: {
            toolbar: [
              "toggleImageCaption",
              "imageTextAlternative",
              "|",
              "imageStyle:inline",
              "imageStyle:wrapText",
              "imageStyle:breakText",
              "|",
              "resizeImage",
            ],
          },
          initialData:
            '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n',
          language: "id",
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
            decorators: {
              toggleDownloadable: {
                mode: "manual",
                label: "Downloadable",
                attributes: {
                  download: "file",
                },
              },
            },
          },
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true,
            },
          },
          placeholder: "Type or paste your content here!",
          style: {
            definitions: [
              {
                name: "Article category",
                element: "h3",
                classes: ["category"],
              },
              {
                name: "Title",
                element: "h2",
                classes: ["document-title"],
              },
              {
                name: "Subtitle",
                element: "h3",
                classes: ["document-subtitle"],
              },
              {
                name: "Info box",
                element: "p",
                classes: ["info-box"],
              },
              {
                name: "Side quote",
                element: "blockquote",
                classes: ["side-quote"],
              },
              {
                name: "Marker",
                element: "span",
                classes: ["marker"],
              },
              {
                name: "Spoiler",
                element: "span",
                classes: ["spoiler"],
              },
              {
                name: "Code (dark)",
                element: "pre",
                classes: ["fancy-code", "fancy-code-dark"],
              },
              {
                name: "Code (bright)",
                element: "pre",
                classes: ["fancy-code", "fancy-code-bright"],
              },
            ],
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
            ],
          },
          translations: [translations],
          mediaEmbed: { previewsInData: true },
        }}
        onReady={(editor) => {
          editor.plugins.get("FileRepository").createUploadAdapter = (
            loader
          ) => {
            return new MyCustomUploadAdapter(loader, editor, setImages);
          };
        }}
      />
    </div>
  );
};

export default CustomCKEditor;
