import Editor from "@/components/editor";
import React from "react";

const border: string = "border-ctp-text/20"

// todo!("update scroll bar")
export default function FileView({
    currentlyActive, available, code, handleClose, handleActiveChange
}:
    {
        currentlyActive: string, available: Set<string>, code: string, handleClose: (name: string) => void, handleActiveChange: (name: string) => void
    }
) {
    let availableElems: React.ReactNode[] = [];
    // this check is needed to sucessfully build the project (when compiling at serverside next thinks available is undefined.)
    if (!available) return <></>
    available.forEach((item, index) => {
        const currentElement = item == currentlyActive;
        availableElems.push(<div
            className={`${border} ${currentElement && ' bg-ctp-base'} border-r text-xs max-h-6 p-1 text-nowrap cursor-pointer`}
            role="button"
            key={index}
            tabIndex={0}
            id={`activeFiles-${item}`}
            onClick={(e) => {
                const name = e.currentTarget.id;
                const node = name.split("activeFiles-")[1];
                handleActiveChange(node);
            }}
        >
            <span className="px-2">{item.split('/').pop()}</span>
            <button className=" text-ctp-subtext0 px-1" name={item} onClick={(e) => {
                const name = e.currentTarget.name;
                e.stopPropagation();
                handleClose(name);
            }}>
                
            </button>
        </div>)
    }
    );


    if (currentlyActive === "") {
        return <div className="w-full"></div>
    }

    return (
        <div className="w-full">
            <div className={`${border} border-b w-full h-6 flex align-middle bg-ctp-mantle`}>
                {...availableElems}
            </div>
            <div className={`${border} border-b w-full h-6 flex align-middle bg-ctp-mantle px-2 p-1 text-xs`}>
                {currentlyActive}
            </div>
            <Editor content={code} />
        </div>
    );
}
