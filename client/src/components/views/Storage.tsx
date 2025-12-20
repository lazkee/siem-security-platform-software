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

    useEffect(() => {
        if(!token) return;

        const fetchData = async () => {
            //setIsLoading(true);

            try{
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

    const handleSearchArchives = async (query: string) => {
        if(!token) return;

        try{
            const data = await storageAPI.searchArchives(query);
            setArchives(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleSortArchives = async (by: "date" | "size" | "name", order: "asc" | "desc") => {
        if(!token) return;

        try{
            const data = await storageAPI.sortArchives(by, order);
            setArchives(data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        setArchives([{
            id: 1,
            fileName: "test_archive.tar",
            fileSize: 123456,
            eventCount: 10,
            createdAt: new Date().toISOString(),
            downloadUrl: ""
        }]);

        setStats({
            totalSize: 123456,
            retentionHours: 72,
            lastArchiveName: "test_archive.tar"
        });

        //setIsLoading(false);
    }, []);

    // if(isLoading) return <div>Loading storage...</div>

    return (
        <>
            {stats && <StorageStats stats={stats}/>}
            <StorageToolBar onSearch={handleSearchArchives} onSort={handleSortArchives} />
            <StorageTable archives={archives}/>
        </>
    );
}