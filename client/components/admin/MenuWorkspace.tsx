import { useState } from "react";
import { AlertTriangle, FileSpreadsheet, Layers, PackagePlus } from "lucide-react";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";
import AllergensManager from "./AllergensManager";
import BulkImport from "./BulkImport";

type MenuSection = "products" | "categories" | "allergens" | "import";

interface Props {
  restaurantId: string;
  planLimit: number;
  productCount: number;
  onProductCountChange: (count: number) => void;
  onCategoryCreated?: () => void;
}

const sections: {
  id: MenuSection;
  label: string;
  detail: string;
  icon: typeof PackagePlus;
}[] = [
  {
    id: "products",
    label: "Productos",
    detail: "Platos, bebidas, precios e ingredientes",
    icon: PackagePlus,
  },
  {
    id: "categories",
    label: "Categorias",
    detail: "Secciones visibles de la carta",
    icon: Layers,
  },
  {
    id: "allergens",
    label: "Alergenos",
    detail: "Alertas alimentarias para clientes",
    icon: AlertTriangle,
  },
  {
    id: "import",
    label: "Importar CSV",
    detail: "Carga rapida desde una hoja de calculo",
    icon: FileSpreadsheet,
  },
];

export default function MenuWorkspace({
  restaurantId,
  planLimit,
  productCount,
  onProductCountChange,
}: Props) {
  const [activeSection, setActiveSection] = useState<MenuSection>("products");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Un solo menu
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">Carta del restaurante</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Cada producto alimenta automaticamente el menu tradicional y la experiencia LSC.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <span className="font-semibold text-foreground">{productCount}</span>
          <span className="text-muted-foreground"> / {planLimit} productos</span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`rounded-lg border p-4 text-left transition ${
                activeSection === section.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <p className="font-semibold text-foreground">{section.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{section.detail}</p>
            </button>
          );
        })}
      </div>

      <div>
        {activeSection === "products" && (
          <ProductsManager
            restaurantId={restaurantId}
            planLimit={planLimit}
            onProductCountChange={onProductCountChange}
          />
        )}
        {activeSection === "categories" && <CategoriesManager restaurantId={restaurantId} />}
        {activeSection === "allergens" && <AllergensManager restaurantId={restaurantId} />}
        {activeSection === "import" && (
          <BulkImport
            restaurantId={restaurantId}
            planLimit={planLimit}
            currentCount={productCount}
          />
        )}
      </div>
    </div>
  );
}
