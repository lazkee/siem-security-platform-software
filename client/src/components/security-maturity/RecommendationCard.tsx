import { RecommendationPriority, SecurityMaturityRecommendationDTO } from "../../models/security-maturity/SecurityMaturityRecommendationDTO";


const priorityColorMap: Record<RecommendationPriority, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#facc15",
  LOW: "#22c55e",
};

export default function RecommendationCard({
  recommendation,
}: {
  recommendation: SecurityMaturityRecommendationDTO;
}) {
  return (
    <div className="rounded-lg border-2 border-[#282A28] bg-[#1f2123] p-5 flex flex-col gap-3 m-2!">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-200 m-3!">
          {recommendation.title}
        </h3>

        <span
          className="font-semibold px-3 py-1 rounded-lg border text-xs p-1! m-2!"
          style={{
            color: priorityColorMap[recommendation.priority],
            borderColor: priorityColorMap[recommendation.priority],
            backgroundColor: `${priorityColorMap[recommendation.priority]}33`,
          }}
        >
          {recommendation.priority}
        </span>
      </div>

      <p className="text-xl text-gray-400 leading-relaxed m-3!">
        {recommendation.description}
      </p>
          
      {recommendation.targetMaturityLevel && (
        <div className="mt-auto! text-xs uppercase tracking-widest text-gray-500 m-3!">
          Target maturity:{" "}
          <span className="text-gray-300 font-bold">
            {recommendation.targetMaturityLevel.replace("_", " ")}
          </span>
        </div>
      )}
    </div>
  );
}
