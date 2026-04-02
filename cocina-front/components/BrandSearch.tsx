"use client";

import { useState, useMemo } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useTranslations } from "next-intl";
import { BRANDS, type Brand } from "@/lib/data/brands";
import { Store, X } from "lucide-react";

type BrandSearchProps = {
  onSelect: (brand: Brand) => void;
  onClear: () => void;
  selectedBrand: Brand | null;
};

export function BrandSearch({ onSelect, onClear, selectedBrand }: BrandSearchProps) {
  const t = useTranslations("BrandSearch");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return BRANDS.slice(0, 10);
    return BRANDS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [query]);

  if (selectedBrand) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[#2d6a4f]/30 bg-[#f0faf5] px-3 py-2">
        <Store size={16} className="text-[#2d6a4f] flex-shrink-0" />
        <span className="text-sm font-medium text-[#2d6a4f]">{selectedBrand.name}</span>
        <span className="text-xs text-gray-500">({selectedBrand.category})</span>
        <button
          onClick={onClear}
          className="ml-auto text-gray-400 hover:text-gray-600"
          aria-label={t("clear")}
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <Command className="rounded-xl border shadow-sm" shouldFilter={false}>
      <CommandInput
        placeholder={t("placeholder")}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-48">
        <CommandEmpty className="py-3 text-center text-sm text-gray-500">
          {t("noResults")}
        </CommandEmpty>
        <CommandGroup>
          {filtered.map((brand) => (
            <CommandItem
              key={brand.name}
              value={brand.name}
              onSelect={() => {
                onSelect(brand);
                setQuery("");
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Store size={14} className="text-gray-400" />
              <span className="font-medium">{brand.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">{brand.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
