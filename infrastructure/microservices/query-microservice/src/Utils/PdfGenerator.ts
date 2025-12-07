import { EventDTO } from "../Domain/DTOs/EventDTO";

export class PdfGenerator {
    
    public static async createReport(events: EventDTO[]): Promise<string> {
        const reportTitle = `Security Event Report (Search Results)`;
        const summary = `Total events found: ${events.length}. Generated on: ${new Date().toLocaleString()}.`;
        
        const rawContent = `${reportTitle}\n${summary}\n\nDetails:\n${JSON.stringify(events.slice(0, 5), null, 2)}...`;
        
        return Buffer.from(rawContent).toString('base64');
    }
}