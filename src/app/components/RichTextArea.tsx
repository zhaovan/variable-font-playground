"use client";
import React from "react";
import { useRef, useState } from "react";

export default function RichTextArea() {
  const [keyDown, setKeyDown] = useState(false);
  const [fontWeight, setFontWeight] = useState(200);
  const [fontSize, setFontSize] = useState(10);

  const [currCharIndex, setCurrCharIndex] = useState(0);
  const containerRef = useRef(null);

  function getCaretIndex() {
    let position = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection();
      if (selection.rangeCount !== 0) {
        const range = window.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(containerRef.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        position = preCaretRange.toString().length;
      }
    }
    return position;
  }

  function isCharacterKeyPress(event) {
    if (typeof event.which == "undefined") {
      // This is IE, which only fires keypress events for printable keys

      return true;
    } else if (
      typeof event.which == "number" &&
      event.which > 0 &&
      event.key.length === 1
    ) {
      // In other browsers except old versions of WebKit, event.which is
      // only greater than zero if the keypress is a printable key.
      // We need to filter out backspace and ctrl/alt/meta key combinations

      return (
        !event.ctrlKey && !event.metaKey && !event.altKey && event.which != 8
      );
    }
    return false;
  }

  function handleKeydown(event) {
    handleCharIndexChange();
    // First keypress down dictates that we should key a new element
    if (keyDown === false && isCharacterKeyPress(event)) {
      setKeyDown(true);
      event.preventDefault();
      const newElement = document.createElement("span");
      newElement.className = `font-[${fontWeight}] text-[${fontSize}px]`;
      newElement.textContent = event.key;
      containerRef.current.insertBefore(
        newElement,
        containerRef.current.children[currCharIndex]
      );
    } else if (keyDown === true && isCharacterKeyPress(event)) {
      //   const childrenLength = containerRef.current.children.length;
      const lastElement = containerRef.current.children[currCharIndex];

      lastElement.className = `text-[${fontSize}px]`;
      lastElement.style.fontSize = `${fontWeight}px`;

      setFontWeight(Math.min(fontWeight + 50, 800));
      setFontSize(fontSize + 1);
    }
  }

  function handleKeyup() {
    setKeyDown(false);
    setFontWeight(200);
    setFontSize(10);
  }

  function handleCharIndexChange() {
    const position = getCaretIndex();

    setCurrCharIndex(position);
  }
  return (
    <div
      contentEditable={true}
      tabIndex={0}
      suppressContentEditableWarning={true}
      onKeyDown={handleKeydown}
      onKeyUp={handleKeyup}
      ref={containerRef}
      className="pl-4 pt-4 flex-grow"
      placeholder="Hi, I'm some placeholder text"
    ></div>
  );
}
