import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import AppShell from "@/components/owner/AppShell";
import EmptyState from "@/components/owner/EmptyState";
import LazyImage from "@/components/owner/LazyImage";
import PageHeader from "@/components/owner/PageHeader";
import CategoryFormSheet from "@/components/owner/categories/CategoryFormSheet";
import { MdAdd, MdArrowDownward, MdArrowUpward, MdOutlineGridView } from "react-icons/md";
import { listCategories, createCategory, updateCategory, deleteCategory } from "@/lib/categoriesData.mjs";
import { listMenu } from "@/lib/menuData.mjs";
import { swapDisplayOrder } from "@/lib/reorder.mjs";

export default function HomeCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheet, setSheet] = useState(null);

  const refresh = useCallback(() => listCategories().then(setCategories).catch(() => {}), []);

  useEffect(() => {
    Promise.all([refresh(), listMenu().then(setSections).catch(() => {})]).finally(() =>
      setIsLoading(false)
    );
  }, [refresh]);

  async function handleSave(fields) {
    if (sheet.id) {
      await updateCategory(sheet.id, fields);
    } else {
      await createCategory(fields, categories.length);
    }
    await refresh();
  }

  async function handleDelete() {
    await deleteCategory(sheet.id, sheet.imageUrl);
    setSheet(null);
    await refresh();
  }

  async function handleMove(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;
    await swapDisplayOrder("menu_categories", categories[index], categories[target]);
    await refresh();
  }

  const sectionTitleById = new Map(sections.map((section) => [section.id, section.title]));

  return (
    <AppShell>
      <Head>
        <title>Home categories — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow="Manage" title="Home categories" backHref="/profile" />

      <div className="flex flex-col gap-3 px-5">
        <p className="text-xs leading-relaxed text-muted">
          These are the shortcut icons customers see at the top of the home screen (Mandi, Starters, etc.).
          Tapping one jumps to the menu section you link it to.
        </p>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Loading categories…</p>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={MdOutlineGridView}
            title="No categories yet"
            message="Add one below and it shows up on the customer app's home screen immediately."
          />
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              className="shadow-soft flex items-center gap-3 rounded-2xl border border-line/60 bg-surface p-3"
            >
              <button
                type="button"
                onClick={() => setSheet(category)}
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-canvas"
              >
                {category.imageUrl ? (
                  <LazyImage src={category.imageUrl} alt="" sizes="56px" className="object-contain" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                    No icon
                  </span>
                )}
              </button>

              <button type="button" onClick={() => setSheet(category)} className="min-w-0 flex-1 text-left">
                <p className={`truncate text-sm font-semibold ${category.isActive ? "text-ink" : "text-muted"}`}>
                  {category.label}
                </p>
                <p className="truncate text-xs text-muted">
                  {sectionTitleById.get(category.sectionId) || "No section linked"}
                </p>
                {!category.isActive ? <span className="text-xs text-danger">Hidden</span> : null}
              </button>

              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted disabled:opacity-30"
                  aria-label="Move up"
                >
                  <MdArrowUpward size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === categories.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted disabled:opacity-30"
                  aria-label="Move down"
                >
                  <MdArrowDownward size={15} />
                </button>
              </div>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={() => setSheet({})}
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-3 text-sm font-medium text-accent transition-colors active:bg-accent/5"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/12">
            <MdAdd size={16} />
          </span>
          Add category
        </button>
      </div>

      <CategoryFormSheet
        isOpen={Boolean(sheet)}
        onClose={() => setSheet(null)}
        initialCategory={sheet?.id ? sheet : null}
        sections={sections}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}
