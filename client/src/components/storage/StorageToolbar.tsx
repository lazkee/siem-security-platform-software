import { useState } from "react";
import DropDownMenu from "../events/DropDownMenu";

type Props = {
    onSearch: (query: string) => void;
    onSort: (by: "date" | "size" | "name", order: "asc" | "desc") => void;
}

export default function StorageToolBar({ onSearch, onSort }: Props) {
    const [searchText, setSearchText] = useState("");

    const handleSearch = () => {
        onSearch(searchText.trim());
      };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
    };

    const handleSortChange = (value: number) => {
        switch (value) {
            case 1:
                onSort("name", "asc");
                break;
            case 2:
                onSort("name", "desc");
                break;
            case 3:
                onSort("size", "asc");
                break;
            case 4:
                onSort("size", "desc");
                break;
            case 5:
                onSort("date", "asc");
                break;
            case 6:
                onSort("date", "desc");
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex justify-between items-center w-full px-2! py-2 mb-6! gap-3 ">
            <div className="flex gap-3 ">
                <input
                    type="text"
                    placeholder="Search by file name..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3! py-2! w-[400px]! h-[40px]! rounded-[10px]! border border-[rgba(255,255,255,0.12)] bg-[rgba(0,0,0,0.3)]! text-white text-[13px] outline-none"
                />

                <button
                    onClick={handleSearch}
                    className="px-3! py-2! rounded-[10px]! w-[200px]! h-[40px] bg-[#007a55]! hover:bg-[#9ca3af]! text-white text-[13px] font-semibold cursor-pointer"
                    >
                    Search
                </button>
            </div>

            <DropDownMenu
                OnSortTypeChange={handleSortChange}
                sortName1="Name"
                sortName2="Size"
                sortName3="Date"/>
        </div>
    );
}