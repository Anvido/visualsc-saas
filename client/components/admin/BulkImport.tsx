import { useState } from "react";
import { Download, Upload, AlertCircle, Loader, Check } from "lucide-react";
import Papa from "papaparse";
import { supabase } from "../../lib/supabase";

interface Props {
  restaurantId: string;
  planLimit: number;
  currentCount: number;
}

interface CSVRow {
  "Product Name": string;
  Category: string;
  Description: string;
  Price: string;
  "Featured (Y/N)": string;
}

interface ImportResult {
  successCount: number;
  failureCount: number;
  duplicates: string[];
  errors: { row: number; error: string }[];
}

export default function BulkImport({ restaurantId, planLimit, currentCount }: Props) {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const downloadTemplate = () => {
    const headers = ["Product Name", "Category", "Description", "Price", "Featured (Y/N)"];
    const rows = [
      ["Cappuccino", "Espresso", "Rich espresso with steamed milk", "4.99", "Y"],
      ["Latte", "Espresso", "Smooth espresso and steamed milk", "4.49", "N"],
      ["", "", "", "", ""],
    ];

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "visualsc-menu-template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");
    setImportResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          setProcessing(true);

          const rows = results.data as CSVRow[];
          const result: ImportResult = {
            successCount: 0,
            failureCount: 0,
            duplicates: [],
            errors: [],
          };

          // Get existing categories
          const { data: categories } = await supabase
            .from("categories")
            .select("id, name")
            .eq("restaurant_id", restaurantId);

          // Get existing products
          const { data: existingProducts } = await supabase
            .from("products")
            .select("name")
            .eq("restaurant_id", restaurantId);

          const categoryMap = new Map(
            (categories || []).map((c) => [c.name.toLowerCase(), c.id])
          );
          const existingNames = new Set(
            (existingProducts || []).map((p) => p.name.toLowerCase())
          );

          // Check plan limit
          const remainingSlots = planLimit - currentCount;
          if (rows.length > remainingSlots) {
            throw new Error(`Can only import ${remainingSlots} more products (plan limit: ${planLimit})`);
          }

          // Process rows
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2; // +2 because headers are row 1

            try {
              // Validate required fields
              if (!row["Product Name"]?.trim()) {
                result.errors.push({ row: rowNum, error: "Product name is required" });
                result.failureCount++;
                continue;
              }

              if (!row["Price"]?.trim()) {
                result.errors.push({ row: rowNum, error: "Price is required" });
                result.failureCount++;
                continue;
              }

              if (!row["Category"]?.trim()) {
                result.errors.push({ row: rowNum, error: "Category is required" });
                result.failureCount++;
                continue;
              }

              // Check for duplicates
              if (existingNames.has(row["Product Name"].toLowerCase())) {
                result.duplicates.push(row["Product Name"]);
                result.failureCount++;
                continue;
              }

              // Validate price
              const price = parseFloat(row["Price"]);
              if (isNaN(price) || price < 0) {
                result.errors.push({ row: rowNum, error: "Invalid price" });
                result.failureCount++;
                continue;
              }

              // Find category
              const categoryId = categoryMap.get(row["Category"].toLowerCase());
              if (!categoryId) {
                result.errors.push({
                  row: rowNum,
                  error: `Category "${row["Category"]}" not found`,
                });
                result.failureCount++;
                continue;
              }

              // Insert product
              const { error: insertError } = await supabase
                .from("products")
                .insert({
                  restaurant_id: restaurantId,
                  name: row["Product Name"].trim(),
                  description: row["Description"]?.trim() || "",
                  price,
                  category_id: categoryId,
                  featured: row["Featured (Y/N)"]?.toUpperCase() === "Y",
                  status: "active",
                  ingredients: [],
                });

              if (insertError) throw insertError;

              result.successCount++;
              existingNames.add(row["Product Name"].toLowerCase());
            } catch (err) {
              result.errors.push({
                row: rowNum,
                error: err instanceof Error ? err.message : "Unknown error",
              });
              result.failureCount++;
            }
          }

          setImportResult(result);

          if (result.successCount > 0) {
            setSuccess(
              `Successfully imported ${result.successCount} product${
                result.successCount !== 1 ? "s" : ""
              }!`
            );
          }

          if (result.failureCount > 0) {
            setError(`${result.failureCount} row${result.failureCount !== 1 ? "s" : ""} failed to import`);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error processing file");
        } finally {
          setProcessing(false);
          setUploading(false);
        }
      },
      error: (err) => {
        setError(`CSV parsing error: ${err.message}`);
        setUploading(false);
      },
    });
  };

  const availableSlots = Math.max(0, planLimit - currentCount);

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-foreground mb-6">Bulk Import Products</h2>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex gap-2">
          <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <p className="text-blue-900">
          You can import up to <strong>{availableSlots}</strong> more products ({currentCount}/{planLimit} used).
        </p>
      </div>

      {/* Step 1: Download */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Step 1: Download Template</h3>
        <p className="text-muted-foreground mb-4">
          Download the CSV template and fill in your product information.
        </p>
        <button
          onClick={downloadTemplate}
          className="button-primary flex items-center gap-2"
        >
          <Download size={20} />
          Download Template
        </button>
      </div>

      {/* Step 2: Upload */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Step 2: Upload Filled File</h3>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-background transition-colors">
          <Upload size={48} className="text-muted-foreground mb-4" />
          <span className="text-foreground font-medium text-lg">Drop CSV file here</span>
          <span className="text-sm text-muted-foreground mt-1">or click to select</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading || processing || availableSlots === 0}
            className="hidden"
          />
          {(uploading || processing) && (
            <div className="mt-4 flex items-center gap-2 text-primary">
              <Loader size={20} className="animate-spin" />
              <span>{uploading ? "Uploading..." : "Processing..."}</span>
            </div>
          )}
        </label>

        {availableSlots === 0 && (
          <p className="text-sm text-red-600 mt-4">
            You've reached your product limit. Delete some products to import more.
          </p>
        )}
      </div>

      {/* Import Results */}
      {importResult && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Import Summary</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-2xl font-bold text-green-600">{importResult.successCount}</p>
              <p className="text-sm text-green-700">Products Imported</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-2xl font-bold text-red-600">{importResult.failureCount}</p>
              <p className="text-sm text-red-700">Failed Rows</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-600">{importResult.duplicates.length}</p>
              <p className="text-sm text-yellow-700">Duplicates</p>
            </div>
          </div>

          {importResult.duplicates.length > 0 && (
            <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="font-semibold text-yellow-900 mb-2">Duplicate Products (skipped):</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                {importResult.duplicates.map((name, idx) => (
                  <li key={idx}>• {name}</li>
                ))}
              </ul>
            </div>
          )}

          {importResult.errors.length > 0 && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="font-semibold text-red-900 mb-2">Errors:</p>
              <div className="text-sm text-red-800 space-y-1 max-h-48 overflow-y-auto">
                {importResult.errors.map((err, idx) => (
                  <p key={idx}>
                    <strong>Row {err.row}:</strong> {err.error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Format Guide */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">File Format Guide</h3>
        <div className="space-y-3 text-sm">
          <p>
            <strong>Product Name:</strong> Name of the product (required, must be unique)
          </p>
          <p>
            <strong>Category:</strong> Must match an existing category (required)
          </p>
          <p>
            <strong>Description:</strong> Product description (optional)
          </p>
          <p>
            <strong>Price:</strong> Numeric value like 9.99 (required)
          </p>
          <p>
            <strong>Featured (Y/N):</strong> Y for featured product, N for regular (optional)
          </p>
        </div>
      </div>
    </div>
  );
}
