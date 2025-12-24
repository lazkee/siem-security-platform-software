import { useEffect, useState } from "react";
import { StorageAPI } from "../../api/storage/StorageAPI";
import { useAuth } from "../../hooks/useAuthHook";
import { ArchiveDTO } from "../../models/storage/ArchiveDTO";
import { ArchiveStatsDTO } from "../../models/storage/ArchiveStatsDTO";
import StorageStats from "../storage/StorageStats";
import StorageTable from "../tables/StorageTable";
import StorageToolBar from "../storage/StorageToolbar";


const storageAPI = new StorageAPI();

export default function Storage() {

    const { token } = useAuth();
    const [archives, setArchives] = useState<ArchiveDTO[]>([]);
    const [stats, setStats] = useState<ArchiveStatsDTO | null>(null);
    //const [isLoading, setIsLoading] = useState(true);

    const mockArchives: ArchiveDTO[] = [
        {
            id: 1,
            fileName: "alerts_2024-12-01.tar",
            eventCount: 1200,
            fileSize: 5242880,
            createdAt: "2024-12-01T10:15:00Z",
            downloadUrl: ""
        },
        {
            id: 2,
            fileName: "events_2024-12-02.tar",
            eventCount: 340,
            fileSize: 2097152,
            createdAt: "2024-12-02T12:40:00Z",
            downloadUrl: ""
        },
        {
            id: 3,
            fileName: "alerts_2024-12-03.tar",
            eventCount: 980,
            fileSize: 7340032,
            createdAt: "2024-12-03T09:05:00Z",
            downloadUrl: ""
        },
        {
            id: 4,
            fileName: "events_2024-12-04.tar",
            eventCount: 120,
            fileSize: 1048576,
            createdAt: "2024-12-04T18:22:00Z",
            downloadUrl: ""
        }, 
        {
            id: 5,
            fileName: "events_2024-12-05.tar",
            eventCount: 1560,
            fileSize: 9437184,
            createdAt: "2024-12-05T07:50:00Z",
            downloadUrl: ""
        }
    ];

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            //setIsLoading(true);

            try {
                const [archivesData, statsData] = await Promise.all([
                    storageAPI.getAllArchives(),
                    storageAPI.getStats()
                ]);

                setArchives(archivesData);
                setStats(statsData);
            } catch (err) {
                console.error(err);
            } finally {
                //setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        setArchives(mockArchives);

        setStats({
            totalSize: mockArchives.reduce((s, a) => s + a.fileSize, 0),
            retentionHours: 72,
            lastArchiveName: mockArchives[0].fileName
        });

        //setIsLoading(false);
    }, []);

    const handleSearchArchives = async (query: string) => {
        if (!token) return;

        try {
            const data = await storageAPI.searchArchives(query);
            setArchives(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleSortArchives = async (by: "date" | "size" | "name", order: "asc" | "desc") => {
        if (!token) return;

        try {
            const data = await storageAPI.sortArchives(by, order);
            setArchives(data);
        } catch (err) {
            console.error(err);
        }
    }

    // if(isLoading) return <div>Loading storage...</div>

    return (
        <div className="border-2 border-[#282A28] bg-transparent rounded-[14px]">
            <h2 className="mt-[3px]! p-[5px]! m-[10px]!">Storage</h2>

            {stats && <StorageStats stats={stats} />}

            <div className="my-4!">
                <StorageToolBar onSearch={handleSearchArchives} onSort={handleSortArchives} />
            </div>

            <div className="p-[10px]!">
                <StorageTable archives={archives} />
            </div>
        </div>
    );
}