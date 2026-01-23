import { Router, Request, Response } from "express";
import { Db } from "../../Database/DbConnectionPool";
import { ServiceCheck } from "../../Domain/models/ServiceCheck";
import { ServiceThreshold } from "../../Domain/models/ServiceThreshold";

export class StatusMonitorController {
  private router = Router();

  constructor() {
    this.router.get("/status", this.getStatus.bind(this));
    this.router.get("/checks", this.getChecks.bind(this));
  }

  getRouter() {
    return this.router;
  }

  // poslednji check po servisu
  private async getStatus(_req: Request, res: Response) {
    const thresholdRepo = Db.getRepository(ServiceThreshold);
    const checkRepo = Db.getRepository(ServiceCheck);

    const services = await thresholdRepo.find();
    const result = [];

    for (const s of services) {
      const last = await checkRepo.findOne({
        where: { serviceName: s.serviceName },
        order: { checkedAt: "DESC" },
      });

      result.push({
        serviceName: s.serviceName,
        pingUrl: s.pingUrl,
        lastCheck: last ?? null,
      });
    }

    res.json(result);
  }

  // lista checkova za servis
  private async getChecks(req: Request, res: Response) {
    const service = String(req.query.service || "");
    const limit = Math.min(Number(req.query.limit || 50), 200);

    if (!service) return res.status(400).json({ error: "Missing service query param" });

    const checkRepo = Db.getRepository(ServiceCheck);
    const checks = await checkRepo.find({
      where: { serviceName: service },
      order: { checkedAt: "DESC" },
      take: limit,
    });

    res.json(checks);
  }
}
