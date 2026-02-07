import { AlertPayloadDto } from "../../Domain/types/AlertPayloadDto";
import { AlertForKpi } from "../../Domain/types/AlertForKpi";
import { AlertCategory } from "../../Domain/enums/AlertCategory";
import { parseAlertCategory } from "../../Domain/parsers/parseAlertCategory";
import { isValidDate } from "../utils/dateUtils";
import { validateAlertPayloadDto } from "../validators/alertPayloadValidator";
import { ILogerService } from "../../Domain/services/ILoggerService";

const INVALID_DATE = new Date(0);

type PartialDates = Partial<Pick<AlertForKpi, "createdAt" | "resolvedAt">>;

function invalidAlert(id: number, isFalseAlarm: boolean, partial?: PartialDates): AlertForKpi {
  return {
    id,
    createdAt: partial?.createdAt ?? INVALID_DATE,
    resolvedAt: partial?.resolvedAt, 
    oldestCorrelatedEventAt: INVALID_DATE,
    category: AlertCategory.OTHER,
    isFalseAlarm,
    isValid: false,
  };
}

function tryParseOptionalDate(iso?: string): Date | undefined {
  if (iso === undefined) return undefined;
  const d = new Date(iso);
  return isValidDate(d) ? d : undefined;
}

export function mapAlertPayloadToDomain(payload: AlertPayloadDto, loger: ILogerService): AlertForKpi {
  const errs = validateAlertPayloadDto(payload);
  if (errs.length > 0) {
    loger.log("[AlertPayloadMapper] Alert payload contract violation: " + errs.join(", "));
    return invalidAlert(payload.id, false);
  }

  const createdAt = new Date(payload.createdAt);
  if (!isValidDate(createdAt)) {
    loger.log("[AlertPayloadMapper] Invalid createdAt for alert " + payload.id + " with createdAt value: " + payload.createdAt);
    return invalidAlert(payload.id, payload.isFalseAlarm);
  }

  
  const resolvedAt = tryParseOptionalDate(payload.resolvedAt);
  if (payload.resolvedAt !== undefined && resolvedAt === undefined) {
    loger.log("[AlertPayloadMapper] Invalid resolvedAt for alert " + payload.id + " with resolvedAt value: " + payload.resolvedAt);
      
    return invalidAlert(payload.id, payload.isFalseAlarm, { createdAt });
  }

  const oldestCorrelatedEventAt = new Date(payload.oldestCorrelatedEventAt);
  if (!isValidDate(oldestCorrelatedEventAt)) {
    loger.log("[AlertPayloadMapper] Invalid oldestCorrelatedEventAt for alert " + payload.id + " with oldestCorrelatedEventAt value: " + payload.oldestCorrelatedEventAt);
    return invalidAlert(payload.id, payload.isFalseAlarm, { createdAt, resolvedAt });
  }

  return {
    id: payload.id,
    createdAt,
    resolvedAt, 
    oldestCorrelatedEventAt,
    category: parseAlertCategory(payload.category),
    isFalseAlarm: payload.isFalseAlarm,
    isValid: true,
  };
}
