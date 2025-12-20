import { useState } from "react";

type Props = {
    onSearch: (query: string) => void;
    onSort: (by: "date" | "size" | "name", order: "asc" | "desc") => void;
}

export default function StorageToolBar({ onSearch, onSort } : Props) {
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "size" | "name">("date");
    const [order, setOrder] = useState<"asc" | "desc">("asc");

    return (
        <div style={{display: "flex", gap: "16px", margin: "16px 0"}}>
            <input
                type="text"
                placeholder="Search archives"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />

            <button onClick={() => onSearch(query)}>Search</button>

            <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value as any)}>
                    <option value="date">Date</option>
                    <option value="size">Size</option>
                    <option value="name">Name</option>
            </select>

            <select 
                value={order}
                onChange={e => setOrder(e.target.value as any)}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
            </select>

            <button onClick={() => onSort(sortBy, order)}>Sort</button>
        </div>
    );
}