interface SearchToolBarProps {
    value: string;
    onSearchText: (searchText: string) => void;
    value1: string;
    onEventType: (eventType: string) => void;
    value2: string;
    onDateTo: (dateTo: string) => void;
    value3: string;
    onDateFrom: (dateFrom: string) => void;
    onSearchClick: () => void;
}

export function SearchToolBar({ value, onSearchText, value1, onEventType, value2, onDateTo, value3, onDateFrom, onSearchClick }: SearchToolBarProps) {

    return (
        <>
            <div className="flex justify-start gap-[16px] ml-[10px]!">
                <div className="flex gap-[20px]! items-center mt-[40px]!">
                    <input
                        className="flex-1 px-3! py-2! h-[40px]! rounded-[10px]! w-[400px] border border-[rgba(255,255,255,0.12)] bg-[rgba(0,0,0,0.3)]! text-white text-[13px] outline-none"
                        placeholder="Type..."
                        value={value}
                        onChange={(e) => onSearchText(e.target.value)}
                    />

                </div>
                <div className="grid grid-rows-2">
                    <label>Type:</label>
                    <select
                        className="border border-[rgba(255,255,255,0.12)] bg-[#2d2d2d]! hover:bg-[#9ca3af]! text-white! w-[200px]! rounded-[10px]! p-[4px]! h-[40px]! font-semibold"
                        value={value1}
                        onChange={(e) => onEventType(e.target.value)}
                    >
                        <option value="all">All types</option>
                        <option value="info">Informations</option>
                        <option value="warning">Warnings</option>
                        <option value="error">Errors</option>
                    </select>
                </div>
                <div className="grid grid-rows-2">
                    <label >Date from:</label>
                    <input
                        className="border border-[rgba(255,255,255,0.12)] bg-[#2d2d2d]! text-white text-[#000] w-[200px] rounded-[10px] p-[4px]! h-[40px] font-semibold"
                        type="date"
                        value={value3}
                        onChange={(e) => onDateFrom(e.target.value)}
                    />
                </div>
                <div className="grid grid-rows-2">
                    <label >Date to:</label>
                    <input
                        className="border border-[rgba(255,255,255,0.12)] bg-[#2d2d2d]! text-white w-[200px] rounded-[10px] p-[4px]! h-[40px] font-semibold"
                        type="date"
                        value={value2}
                        onChange={(e) => onDateTo(e.target.value)}
                    />
                </div>
                <button
                    className="bg-[#007a55] text-color w-[200px] rounded-[10px]! p-[4px] h-[40px] mt-[40px]! font-semibold hover:bg-[#9ca3af]"
                    onClick={onSearchClick}
                >
                    Search
                </button>

            </div>
        </>
    )
}