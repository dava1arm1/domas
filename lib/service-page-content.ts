import { getSetting } from "./settings";
import { SERVICE_PAGE_DATA, type ServicePageData } from "@/constants/service-pages";

export async function getServicePageData(id: string): Promise<ServicePageData> {
  const staticData = SERVICE_PAGE_DATA[id];
  if (!staticData) throw new Error(`Unknown service id: ${id}`);

  try {
    const raw = await getSetting(`site.servicePage.${id}`);
    if (!raw) return staticData;
    const parsed = JSON.parse(raw) as ServicePageData;
    if (!parsed || typeof parsed !== "object") return staticData;
    return parsed;
  } catch {
    return staticData;
  }
}
