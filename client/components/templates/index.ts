export { default as ModernCoffeeShop } from "./ModernCoffeeShop";
export { default as GourmetRestaurant } from "./GourmetRestaurant";
export { default as FastCasual } from "./FastCasual";
export { default as AccessibilityFirst } from "./AccessibilityFirst";

export const TEMPLATE_TYPES = {
  "modern-coffee": {
    name: "Coffee Modern",
    description: "Especial para cafeterias, barras de espresso y pasteleria.",
    accent: "#0F766E",
  },
  gourmet: {
    name: "Restaurant Premium",
    description: "Carta editorial para restaurantes de servicio completo.",
    accent: "#8B5E34",
  },
  "fast-casual": {
    name: "Fast Casual",
    description: "Lectura rapida para negocios de alto movimiento.",
    accent: "#E85D04",
  },
  "accessibility-first": {
    name: "Accessibility First",
    description: "La experiencia VISUALSC con accesibilidad como primer gesto.",
    accent: "#2654D9",
  },
} as const;

export type TemplateType = keyof typeof TEMPLATE_TYPES;
