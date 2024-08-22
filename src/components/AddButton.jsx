import React, { useContext } from "react";
import Plus from "../icons/Plus";
import colors from "../assets/colors.json";
import { useRef } from "react";
import { db } from "../appwrite/databases";
import { NoteContext } from "../context/NoteContext";

const AddButton = () => {
  const startingPos = useRef(10);
  // use different color each time, it is added
  const colorOption = useRef(0);

  const { setNotes } = useContext(NoteContext);

  const addNote = async () => {
    const payload = {
      position: JSON.stringify({
        x: startingPos.current,
        y: startingPos.current,
      }),
      colors: JSON.stringify(colors[colorOption.current]),
    };
    console.log("Clicked");

    startingPos.current += 10;
    colorOption.current = (colorOption.current + 1) % 4;

    const response = await db.notes.create(payload);

    setNotes((prevState) => [response, ...prevState]);
  };

  return (
    <div id="add-btn" onClick={addNote}>
      <Plus />
    </div>
  );
};

export default AddButton;
