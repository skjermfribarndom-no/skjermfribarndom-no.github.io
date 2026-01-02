export type KlassetrinnType = "1" | "2" | "3" | "4" | "5" | "6" | "7";
interface SchoolPledges {
  total: number;
  perKlassetrinn: Partial<Record<KlassetrinnType, number>>;
}

export type SchoolPledgeMap = Record<string, SchoolPledges>;
export interface SchoolData {
  navn: string;
  data: SchoolPledge;
}

type PledgeMap = Record<
  string,
  {
    navn: string;
    kommuner: Record<
      string,
      { navn: string; skoler: Record<string, SchoolData> }
    >;
  }
>;

export const pledges: {
  date: string;
  pledgeCount: number;
  schools: Record<string, SchoolPledgeMap>;
  pledgesByFylke: PledgeMap;
};
