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
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  CloudServices,
  Essentials,
  MediaEmbed,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HtmlComment,
  HtmlEmbed,
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
  Paragraph,
  RemoveFormat,
  SelectAll,
  ShowBlocks,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Style,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  Title,
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
              "mediaEmbed", 
              "link",
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
            shouldNotGroupWhenFull: true,
          },
          plugins: [
            AccessibilityHelp,
            Alignment,
            Autoformat,
            AutoImage,
            Autosave,
            BalloonToolbar,
            BlockQuote,
            BlockToolbar,
            Bold,
            CloudServices,
            Essentials,
            MediaEmbed,
            FindAndReplace,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            FullPage,
            GeneralHtmlSupport,
            Heading,
            Highlight,
            HtmlComment,
            HtmlEmbed,
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
            Paragraph,
            RemoveFormat,
            SelectAll,
            ShowBlocks,
            SourceEditing,
            SpecialCharacters,
            SpecialCharactersArrows,
            SpecialCharactersCurrency,
            SpecialCharactersEssentials,
            SpecialCharactersLatin,
            SpecialCharactersMathematical,
            SpecialCharactersText,
            Style,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextPartLanguage,
            TextTransformation,
            Title,
            TodoList,
            Underline,
            Undo,
          ],
          balloonToolbar: [
            "bold",
            "italic",
            "|",
            "link",
            "|",
            "bulletedList",
            "numberedList",
          ],
          blockToolbar: [
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
            "link",
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
          htmlSupport: {
            allow: [
              { name: /^.*$/, styles: true, attributes: true, classes: true },
            ],
          },
          language: "id",
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
            decorators: {
              toggleDownloadable: {
                mode: "manual",
                label: "Downloadable",
                attributes: { download: "file" },
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
          menuBar: { isVisible: true },
          style: {
            definitions: [
              { name: "Article category", element: "h3", classes: ["category"] },
              { name: "Title", element: "h2", classes: ["document-title"] },
              { name: "Subtitle", element: "h3", classes: ["document-subtitle"] },
              { name: "Info box", element: "p", classes: ["info-box"] },
              {
                name: "Side quote",
                element: "blockquote",
                classes: ["side-quote"],
              },
              { name: "Marker", element: "span", classes: ["marker"] },
              { name: "Spoiler", element: "span", classes: ["spoiler"] },
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
          editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return new MyCustomUploadAdapter(loader, editor, setImages);
          };
        }}
      />
    </div>
  );
};

export default CustomCKEditor;
