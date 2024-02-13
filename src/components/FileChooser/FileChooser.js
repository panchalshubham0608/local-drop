import React, { useCallback, useState } from "react";
import './FileChooser.css';

// drag drop file component
function DragDropFile(props) {
  const [files, setFiles] = useState([]);
    // drag state
    const [dragActive, setDragActive] = React.useState(false);
    // ref
    const inputRef = React.useRef(null);

    const changeFiles = useCallback((targetFiles) => {
      if (files && files.length > 0) {
        if(!window.confirm("Are you sure you want to change files?"))
          return;
      }
      setFiles(Array.from(targetFiles));
    }, [files, setFiles]);
    
    // handle drag events
    const handleDrag = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
    
    // triggers when file is dropped
    const handleDrop = function(e) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        changeFiles(e.dataTransfer.files);
        // setFiles(e.dataTransfer.files);
      }
    };
    
    // triggers when file is selected with click
    const handleChange = function(e) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        changeFiles(e.target.files);
        // setFiles(e.target.files);
      }
    };
    
  // triggers the input when the button is clicked
    const onButtonClick = () => {
      inputRef.current.click();
    };

    const hanldeSendFiles = () => {
      if (props.setFiles) {
        props.setFiles(files);
      }
    }
    
    return (
      <div>
        <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
          <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
          <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
            <div>
              <p>
                Drag and drop your files here <br/>
                or <br/>
                <button className="upload-button theme-size" onClick={onButtonClick}>Upload files</button>
              </p>
            </div> 
          </label>
          { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
        </form>
        {(files && files.length > 0) &&
          <div>
            <button className="btn btn-primary mt-5 w-100"
              onClick={hanldeSendFiles}>
              Send {files.length} file(s)
            </button>
          </div>}
      </div>
    );
  };


const FileChooser = (props) => {
    const { deviceName, handleChangedeviceName, setFiles } = props;

    return (
        <div className="file-chooser-page theme-size">
            <p className="sticky-top">
              You are visible as
              <button className="btn-transparent theme-size"
                onClick={handleChangedeviceName}
              ><strong>{deviceName}</strong></button>
            </p>
            <h1>Drag & Drop your files</h1>
            <DragDropFile setFiles={setFiles} />
        </div>
    )
};

export default FileChooser;
