'use client'
import  { Dispatch, SetStateAction } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, Square } from "lucide-react";
import { Shape } from "./Canvas";

const Topbar = ({selectedIcon , setSelectedIcon}: {selectedIcon:Shape ,setSelectedIcon:Dispatch<SetStateAction<Shape>>}) => {
  //const [selectedIcon, setSelectedIcon] = useState<Shape>("square");
  return (
    <div className=" fixed top-5 left-150  ">
      <div className=" bg-neutral-600 rounded-md p-2 shadow-lg  gap-2  flex-wrap flex  items-center justify-center ">
        <IconButton
          icon={<Square size={20} />}
          onClick={() => setSelectedIcon("rect")}
          isSelected={selectedIcon === "rect"}
          tooltip="Rectangle"
        />
        <IconButton
          icon={<Circle size={20} />}
          onClick={() => setSelectedIcon("circle")}
          isSelected={selectedIcon === "circle"}
          tooltip="Circle"
        />
        <IconButton
          icon={<Pencil size={20} />}
          onClick={() => setSelectedIcon("pencil")}
          isSelected={selectedIcon === "pencil"}
          tooltip="Pencil"
        />
      </div>
    </div>
  );
};

export default Topbar;
