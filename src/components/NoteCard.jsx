import React, { useState } from "react";
import { useRef, useEffect } from "react";
import Trash from "../icons/Trash";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { db } from "../appwrite/databases";

const NoteCard = ({ note }) => {
  const body = bodyParser(note.body);
  const colors = JSON.parse(note.colors);
  const [position, setPosition] = useState(JSON.parse(note.position));

  const textAreaRef = useRef(null);

  let mouseStartPos = { x: 0, y: 0 };
  const cardRef = useRef(null);

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);

    saveData("position", newPosition);

    db.notes.update(note.$id, {
      position: JSON.stringify(newPosition),
    });
  };

  const saveData = (key, value) => {
    const payload = {
      // don't forget the square bracket around key
      // else the key will be 'key' and not the dynamic value of `key`
      [key]: JSON.stringify(value),
    };

    try {
      db.notes.update(note.$id, payload);
    } catch (error) {
      console.log(error);
    }
  };

  const mouseDown = (e) => {
    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    setZIndex(cardRef.current);
  };

  const mouseMove = (e) => {
    const mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    // console.log("mouseMovDir:", mouseMoveDir);

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPosition(newPosition);
  };

  useEffect(() => {
    autoGrow(textAreaRef);
  }, []);

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={mouseDown}
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <Trash />
      </div>

      <div className="card-body">
        <textarea
          ref={textAreaRef}
          style={{ color: colors.colorText }}
          defaultValue={body}
          onInput={() => {
            autoGrow(textAreaRef);
          }}
          onFocus={() => {
            setZIndex(cardRef.current);
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;
