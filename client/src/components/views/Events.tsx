import AllEventsTable from "../tables/AllEventsTable";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuthHook";
import { EventDTO } from "../../models/events/EventDTO";
import { EventType } from "../../enums/EventType";
import DropDownMenu from "../events/DropDownMenu";
import { QueryAPI } from "../../api/query/QueryAPI";

interface EventRow { 
    id: number;
    source: string;
    time: string;
    type: EventType;
    description:string;
}

export default function Events() {
    const { token } = useAuth();

    const [searchText, setSearchText] = useState("");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [eventType, setEventType] = useState<string>("all");

    const [sortType, setSortType] = useState(0);
    const [transition, setTransition] = useState(false);
    const [events, setEvents] = useState<EventRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const eventDivStyle: React.CSSProperties = {
        border: "2px solid #d0d0d0",
        backgroundColor: "transparent",
        borderRadius: "14px",
        borderColor: "#d0d0d0",
    };

    const downloadStyle: React.CSSProperties = {
        backgroundColor: "transparent",
        borderRadius: "15px",
        width: "15%",
        color: "#d0d0d0",
        transition: transition ? "transform 0.3s ease-in" : "transform 0.3s ease-in",
        transform: transition ? "scale(1.2)" : "scale(1.0)",
    };

    const firstRowStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "left",
        gap: "50px",
        marginInlineStart: "15px",
    };

    const elementsStyle: React.CSSProperties = {
        background: "#d0d0d0",
        color: "#000000ff",
        width: "15%",
        borderRadius: "15px",
        padding: "4px",
        height: "40px"
    };

    const searchInputStyle: React.CSSProperties = {
        ...elementsStyle, 
        width: "250px",  
    };

    const dateInputStyle: React.CSSProperties = {
        ...elementsStyle, 
        width: "180px",  
        marginLeft: "15px"
    };

    const selectStyle: React.CSSProperties = {
        ...elementsStyle, 
        width: "110px",  
        marginLeft: "15px"
    };

    const secondRowStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        margin: "10px",
    };

    const leftSideStyle: React.CSSProperties = {
        display: "flex",
        gap: "10px",
        justifyContent: "left",
        width: "100%",
        alignItems: "center",
    };
    

    const rightSideStyle: React.CSSProperties = {
        display: "flex",
        gap: "15px",
        justifyContent: "right",
        width: "100%",
        alignItems: "center",
    };

    const formatTime = (iso: string): string => {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return iso;

        const pad = (n: number) => n.toString().padStart(2, "0");

        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();

        // isti stil kao pre: "HH:MM:SS   DD/MM/YYYY"
        return `${hours}:${minutes}:${seconds}   ${day}/${month}/${year}`;
    };

    const mapEventDTOToRow = (e: EventDTO): EventRow => {
        let type: EventRow["type"];
        switch (e.type) {
            case "ERROR":
                type = EventType.ERROR;
                break;
            case "WARNING":
                type = EventType.WARNING;
                break;
            case "INFO":
            default:
                type = EventType.INFO;
                break;
        }

        return {
            id: e.id,
            source: e.source.toString(),
            time: formatTime(e.timestamp),
            type,
            description: e.description.toString(),
        };
    };

    const loadEventsWithQuery = async () => {
        if (!token) {
            console.error("No auth token available.");
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);

            const api = new QueryAPI();
            
            // pravi se query za search
            // npr: text=server
            let query =
                searchText && searchText.trim() !== ""
                    ? `text=${searchText}`
                    : "";
                
            
            // dodaje se dateFrom
            if (dateFrom && dateFrom.trim() !== "") {
                const fromDate = new Date(dateFrom);
                query += query ? `|dateFrom=${fromDate.toISOString()}` : `dateFrom=${fromDate.toISOString()}`;
            }

            // dodaje se dateTo
            if (dateTo && dateTo.trim() !== "") {
                const toDate = new Date(dateTo);
                query += query ? `|dateTo=${toDate.toISOString()}` : `dateTo=${toDate.toISOString()}`;
            }

            // dodaje se eventType
            if (eventType && eventType !== "all") {
                query += query ? `|type=${eventType.toUpperCase()}` : `type=${eventType.toUpperCase()}`;
            }
            
            const data: EventDTO[] = await api.getEventsByQuery(query, token);
            const mapped = data.map(mapEventDTOToRow);

            setEvents(mapped);
        } catch (err) {
            console.error(err);
            setError("Search failed.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;

        const loadAllEvents = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const api = new QueryAPI();

                const data: EventDTO[] = await api.getAllEvents(token); 
                const mapped = data.map(mapEventDTOToRow);
                setEvents(mapped);
            } catch (err) {
                console.error(err);
                setError("Failed to load events.");
            } finally {
                setIsLoading(false);
            }
        };

        void loadAllEvents();
    }, [token]);

    return (
        <div style={eventDivStyle}>
            <h3 style={{ padding: "10px", margin: "10px" }}>Events</h3>

            <div style={firstRowStyle}>
                <div>
                    Date from:
                    <input
                        style={dateInputStyle}
                        type="datetime-local"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                    />
                </div>
                <div>
                    Date to:
                    <input
                        style={dateInputStyle}
                        type="datetime-local"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                    />
                </div>

                <div>
                    Type:
                    <select 
                        style={selectStyle} 
                        value={eventType} 
                        onChange={(e) => setEventType(e.target.value)}>
                            <option value="all">All types</option>
                            <option value="info">Informations</option>
                            <option value="warning">Warnings</option>
                            <option value="error">Errors</option>
                    </select>
                </div>
            </div>
            <div style={secondRowStyle}>
                <div style={leftSideStyle}>
                    <input
                        style={searchInputStyle}
                        placeholder="Type..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value.toString())}
                    />
                    <button
                        style={elementsStyle}
                        onClick={() => loadEventsWithQuery()}
                    >
                        Search
                    </button>
                </div>
                <div style={rightSideStyle}>
                    <DropDownMenu OnSortTypeChange={(value:number)=>setSortType(value)}/>
                    <button
                        style={downloadStyle}
                        onMouseEnter={() => setTransition(true)}
                        onMouseLeave={() => setTransition(false)}
                    >
                        Download report <FiDownload size={20} />
                    </button>
                </div>
            </div>

            <div style={{ margin: "10px" }}>
                {isLoading && (
                    <div style={{ marginBottom: "8px", color: "#d0d0d0" }}>
                        Loading events...
                    </div>
                )}

                {error && !isLoading && (
                    <div style={{ marginBottom: "8px", color: "#ff4d4f" }}>
                        {error}
                    </div>
                )}

                <AllEventsTable events={events} sortType={sortType} searchText={searchText} />
            </div>
        </div>
    );
}
