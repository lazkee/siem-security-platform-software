export const AnomalyResultResponseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Concise anomaly name (e.g., 'Brute Force Attack Detected')",
      },
      description: {
        type: "string",
        description: "Detailed explanation of the suspicious behavior pattern",
      },
      correlatedAlerts: {
        type: "array",
        items: { type: "integer" },
        description: "Array of alert IDs that form this pattern (minimum 1)",
        minItems: 1,
      },
      userId: {
        type: "string",
        nullable: true,
        description: "User ID associated with this anomaly (string or null)",
      },
      userRole: {
        type: "string",
        nullable: true,
        description: "User role if available from alerts (string or null)",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "ISO 8601 timestamp of when anomaly was detected",
      },
    },
    required: ["title", "description", "correlatedAlerts"],
  },
};
