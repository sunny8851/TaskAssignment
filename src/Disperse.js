import React, { useRef, useState } from "react";
import "./disperse.css";
const Disperse = () => {
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);
  const [duplicateErrorMessage, setDuplicateErrorMessage] = useState([]);
  const [arr, setArr] = useState([]);
  //onclick check for errors and duplicates
  const verify = async () => {
    setArr([]);
    setErrorMessage([]);
    setDuplicateErrorMessage([]);
    const text = inputText.split("\n");
    let newArr = [];
    for (let i = 0; i < text.length; i++) {
      let line;
      //check for amount errors
      if (text[i].includes("=")) {
        line = text[i].split("=");
        newArr.push({ key: line[0], value: line[1] });
        setArr((pre) => {
          return [...pre, { key: line[0], value: line[1], char: "=" }];
        });
      } else if (text[i].includes(",")) {
        line = text[i].split(",");
        newArr.push({ key: line[0], value: line[1] });
        setArr((pre) => {
          return [...pre, { key: line[0], value: line[1], char: "," }];
        });
      } else {
        line = text[i].split(" ");
        newArr.push({ key: line[0], value: line[1] });
        setArr((pre) => {
          return [...pre, { key: line[0], value: line[1], char: " " }];
        });
      }

      let isTrue = /[^0-9]/g.test(line[1]);
      if (isTrue) {
        setErrorMessage((newErrorMessage) => {
          return [...newErrorMessage, `Line ${i + 1} wrong amount `];
        });
      } else if (line[0] < 0) {
        setErrorMessage((newErrorMessage) => {
          return [...newErrorMessage, `Line ${i + 1} wrong amount `];
        });
      }
    }
    //check for duplicated
    let b = new Set();
    for (let i = 0; i < newArr.length; i++) {
      const a = [];
      a.push(i + 1);
      for (let j = i + 1; j < newArr.length; j++) {
        if (newArr[j].key == newArr[i].key && !b.has(newArr[j].key)) {
          a.push(j + 1);
        }
      }
      b.add(newArr[i].key);
      if (a.length > 1) {
        setDuplicateErrorMessage((newErrorMessage) => {
          return [...newErrorMessage, `${newArr[i].key} ${a.toString()} `];
        });
      }
    }
  };
  //combine all amount
  function combineDuplicateHashes() {
    setDuplicateErrorMessage([]);
    const combinedObject = {};
    for (const obj of arr) {
      const key = obj.key;
      const value = obj.value;
      if (combinedObject[key] !== undefined) {
        let temp = Number(value) + Number(combinedObject[key]);
        combinedObject[key] = temp.toString();
      } else {
        combinedObject[key] = value;
      }
    }

    const ans = Object.entries(combinedObject).map(([key, value]) => ({
      key,
      value,
    }));
    setInputText("");
    for (let i = 0; i < ans.length; i++) {
      if (i != ans.length - 1) {
        setInputText((pre) => {
          return pre + `${ans[i].key} ${ans[i].value}\n`;
        });
      } else {
        setInputText((pre) => {
          return pre + `${ans[i].key} ${ans[i].value}`;
        });
      }
    }
  }
  //keep first one
  function keepFirst() {
    setDuplicateErrorMessage([]);
    const ans = Array.from(new Set(arr.map((item) => item.key)), (key) =>
      arr.find((obj) => obj.key === key)
    );
    setInputText("");
    for (let i = 0; i < ans.length; i++) {
      if (i != ans.length - 1) {
        setInputText((pre) => {
          return pre + `${ans[i].key}${ans[i].char}${ans[i].value}\n`;
        });
      } else {
        setInputText((pre) => {
          return pre + `${ans[i].key}${ans[i].char}${ans[i].value}`;
        });
      }
    }
  }
  //combiniong both scrollbars of line number and textbox
  const textareaRef = useRef(null);
  const lineNumberDivRef = useRef(null);
  const handleTextareaScroll = () => {
    lineNumberDivRef.current.scrollTop = textareaRef.current.scrollTop;
  };
  const handleLineNumberDivScroll = () => {
    textareaRef.current.scrollTop = lineNumberDivRef.current.scrollTop;
  };

  return (
    <div>
      <div className="text-sm text-gray-400 py-2 font-medium">
        Addresses with Amount
      </div>
      <div className="flex code-editor-container bg-[#f5f6fa] p-4 gap-2">
        <div
          className="line-number-container "
          onScroll={handleLineNumberDivScroll}
          ref={lineNumberDivRef}
        >
          {Array.from({ length: inputText.split("\n").length }, (_, index) => (
            <div key={index} className="line-number">
              {index + 1}
            </div>
          ))}
        </div>
        <div className="bg-gray-300 w-[1px] "></div>
        <textarea
          value={inputText}
          rows="1"
          onScroll={handleTextareaScroll}
          ref={textareaRef}
          onChange={(e) => setInputText(e.target.value)}
          className="bg-[#f5f6fa] code-textarea outline-none p-1  w-full"
        />
      </div>
      <span className="text-sm text-gray-400 py-2 font-medium">
        Separated by ',' or '=' or ' '
      </span>
      {errorMessage.length == 0 && duplicateErrorMessage.length > 0 && (
        <div className="text-red-400 text-sm flex items-center justify-between mt-5">
          <div>Duplicated</div>
          <div className="flex  items-center gap-2 ">
            <span className="cursor-pointer" onClick={keepFirst}>
              Keep the first one
            </span>
            <div className="w-[2px] h-4 bg-red-400"></div>
            <span className="cursor-pointer" onClick={combineDuplicateHashes}>
              Combine Balance
            </span>
          </div>
        </div>
      )}
      {(errorMessage.length > 0 || duplicateErrorMessage.length) > 0 && (
        <div className="text-red-400 text-sm  rounded flex gap-5 r px-2 border-[2px] py-1 border-red-300 mt-3">
          <img
            className="h-6 w-6"
            src="https://cdn.icon-icons.com/icons2/3641/PNG/512/info_red_button_icon_227838.png"
          />
          <div>
            {errorMessage.length > 0
              ? errorMessage.map((m, index) => <div key={index}>{m}</div>)
              : duplicateErrorMessage.map((m, index) => (
                  <div key={index}>{m}</div>
                ))}
          </div>
        </div>
      )}
      <button
        onClick={verify}
        className="w-full bg-blue-600 text-white py-2 mt-5 "
      >
        Next
      </button>
    </div>
  );
};
export default Disperse;
