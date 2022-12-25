import { GoTextSize } from 'react-icons/go';
import * as React from 'react';
import { useRef, useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';
import TextField from '@material-ui/core/TextField';
import ColorPicker from 'material-ui-color-picker';
import { FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import { Editor } from 'react-draft-wysiwyg';
import { DesignerComponent } from './DesignerComponent';
import { capitalizeFirst } from '../utils';
import { changeTextColor, changeTextValue, TextElement } from '../reducers/componentInteractions';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

type TextProps = {
    id: number
}

type State = {
    text: string
}
type TextComponentState = State

class Text extends DesignerComponent {
    type = 'text'

    icon = TextFieldsIcon

    defaultElement: TextElement = {
      isLocked: false,
      id: '0',
      type: 'text',
      width: 98,
      height: 23,
      fontSize: 15,
      textColor: 'black',
      location: { page: '0', point: { x: 0, y: 0 } },
      text: '<p> hello world!</p>',
      rotateAngle: 0,
    }

    render(element: TextElement) {
      return (
        <span style={{ fontSize: `${element.fontSize}pt`, color: element.textColor }}>

          <div dangerouslySetInnerHTML={{ __html: element.text }} />

        </span>
      );
    }

    renderProperties(selectedElement: TextElement): JSX.Element {
      return <TextProperties selectedElement={selectedElement} />;
    }
}

export default new Text();

function TextProperties({ selectedElement }:{selectedElement:TextElement}): JSX.Element {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  React.useEffect(() => {
    const contentBlock = htmlToDraft(selectedElement.text);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    setEditorState(EditorState.createWithContent(contentState));
  }, [selectedElement.id, selectedElement.text]);
  const dispatch = useDispatch();

  return (
    <div style={{ background: 'white', height: '100%' }}>
      <FormLabel component="legend">Text Properties</FormLabel>

      <div>

        <Editor
          toolbar={{
            options: ['colorPicker', 'inline', 'fontSize', 'list', 'textAlign', 'history'],
            list: {
              options: ['unordered', 'ordered'],
            },
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
          }}
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={(state) => {
            setEditorState(state);
            const text = draftToHtml(convertToRaw(state.getCurrentContent()));
            dispatch(changeTextValue({ id: selectedElement.id, text }));
          }}
        />

      </div>
    </div>
  );
}
