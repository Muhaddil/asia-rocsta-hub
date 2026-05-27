import type { CommunityMember } from "./types";
import { parts } from "./parts";
import { compatibilities } from "./compatibility";
import { guides } from "./guides";
import { problems } from "./problems";

export const communityMembers: CommunityMember[] = [
  // {
  //   id: "cm-001",
  //   name: "TEST",
  //   country: "🇪🇸",
  //   avatarColor: "bg-red-500 text-white",
  //   contributions: 142,
  //   speciality: "TEST",
  //   joinedYear: 2019,
  // },
];

export const communityStats = {
  get partsDocumented() {
    return parts.length;
  },
  get verifiedEquivalences() {
    return compatibilities.filter((c) => c.verified).length;
  },
  get repairGuides() {
    return guides.length;
  },
  get registeredProblems() {
    return problems.length;
  },
  get downloadedManuals() {
    return 6420;
  },
  get totalContributions() {
    const baseContributions = communityMembers.reduce(
      (sum, member) => sum + member.contributions,
      0,
    );
    return baseContributions + parts.length + compatibilities.length + guides.length;
  },
};
