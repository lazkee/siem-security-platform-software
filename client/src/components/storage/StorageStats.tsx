//za gornje kartice, koristice se statcard

import { BsDatabase } from "react-icons/bs";
import { ArchiveStatsDTO } from "../../models/storage/ArchiveStatsDTO"
import StatCard from "../stat_card/StatCard";
import { MdAccessTime } from "react-icons/md";
import { FiArchive } from "react-icons/fi";

type Props = {
    stats: ArchiveStatsDTO;
}

export default function StorageStats({stats} : Props){

    const totalSizeGB = (stats.totalSize / (1024 ** 3)).toFixed(2);

    return (
        <div className="flex items-center gap-5 height-[20%] width-[100%] p-[10px]!">
            <StatCard
                title="Total archive size"
                value= { Number(totalSizeGB) }    
                valueDescription="GB"
                icon={<BsDatabase />}
                iconColor="#60cdff"
            />

            <StatCard 
                title="Retention Policy"
                value={stats.retentionHours}
                valueDescription="h"
                icon={<MdAccessTime />}
                iconColor="#ffa500"
            />

            <StatCard 
                title="Last archive"
                value={stats.lastArchiveName ?? "-"}
                icon={<FiArchive />}
                iconColor="#4ade80"
            />
        </div>
    );
}