import data from "@/lib/data/ro-localities.json";

interface CountyData {
  name: string;
  localitati: string[];
}

const counties = (data as { judete: CountyData[] }).judete;
const byCounty = new Map(counties.map((c) => [c.name, c.localitati]));

/** All localities for a county (empty array if the county is unknown). */
export function localitiesForCounty(county: string): string[] {
  return byCounty.get(county) ?? [];
}

/** Whether a locality belongs to the given county (used for server validation). */
export function isValidLocality(county: string, locality: string): boolean {
  return byCounty.get(county)?.includes(locality) ?? false;
}
