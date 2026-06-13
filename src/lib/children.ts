import type { ActivityType, ChildInput } from "@/types";

export function getSharedWants(children: ChildInput[]): ActivityType[] {
  if (children.length === 0) {
    return [];
  }
  if (children.length === 1) {
    return [...children[0].wants];
  }

  return children[0].wants.filter((want) =>
    children.every((child) => child.wants.includes(want)),
  );
}

export function childrenShareWants(children: ChildInput[]): boolean {
  if (children.length <= 1) {
    return true;
  }
  return getSharedWants(children).length > 0;
}

export function maxWantsForChildCount(count: number): number {
  return count <= 1 ? 3 : 2;
}
