import type {
  CartTransformRunInput,
  CartTransformRunResult,
} from "../generated/api";

export function cartTransformRun(
  input: CartTransformRunInput
): CartTransformRunResult {
  const bundleEntries: {id: string, items: string[]}[] = [];
  input.cart.lines.forEach((line) => {
    if (line.bundleItems?.value) {
      bundleEntries.push({
        id: line.id,
        items: line.bundleItems.value.split(",").map((item) => item.trim()),
      });
    }
  });

  if (bundleEntries.length > 0) {
    return {
      operations: [
        ...bundleEntries.map((entry) => ({
          lineExpand: {
            cartLineId: entry.id,
            expandedCartItems: entry.items.map((item) => ({
              merchandiseId: `gid://shopify/ProductVariant/${item}`,
              quantity: 1,
            })),
          }
        })),
      ],
    };
  }

  return {
    operations: [],
  };
}
