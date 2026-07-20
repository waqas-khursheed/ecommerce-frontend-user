import type { ProductAttributeAssignment } from "@/types/product";

export type VariantKey = "color_id" | "size_id" | "fitting_id";

export interface VariantGroup {
  key: VariantKey;
  label: string;
  items: ProductAttributeAssignment["attribute"][];
}

// Stock only has 3 physical columns (color_id/size_id/fitting_id) — not a
// hardcoded "this is always Color" contract, just 3 generic slots pointing
// at attribute_items. Whatever attribute types are actually assigned to a
// product (Size for a T-shirt, Capacity for a water bottle, or none for a
// plain kitchen item) get grouped here by their real ProductAttribute id,
// sorted ascending, and mapped onto those 3 slots *positionally* — the
// first (lowest id) attribute type assigned to a product always lands in
// the color_id slot, the second in size_id, the third in fitting_id. The
// displayed label is always the real attribute_title, never a hardcoded
// "Color"/"Size"/"Fitting" string. This must stay in lockstep with
// frontend_admin's Stock form, which assigns slots the same way.
const SLOT_ORDER: VariantKey[] = ["color_id", "size_id", "fitting_id"];

export function groupVariantOptions(assignments: ProductAttributeAssignment[]): VariantGroup[] {
  const byAttributeTypeId = new Map<number, { title: string; items: ProductAttributeAssignment["attribute"][] }>();

  for (const assignment of assignments) {
    const typeId = assignment.attribute.attribute.id;
    if (!byAttributeTypeId.has(typeId)) {
      byAttributeTypeId.set(typeId, { title: assignment.attribute.attribute.attribute_title, items: [] });
    }
    byAttributeTypeId.get(typeId)!.items.push(assignment.attribute);
  }

  const sortedTypeIds = Array.from(byAttributeTypeId.keys()).sort((a, b) => a - b);

  return sortedTypeIds.slice(0, SLOT_ORDER.length).map((typeId, index) => {
    const { title, items } = byAttributeTypeId.get(typeId)!;
    return { key: SLOT_ORDER[index], label: title, items };
  });
}
