import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import AppShell from "@/components/owner/AppShell";
import EmptyState from "@/components/owner/EmptyState";
import PageHeader from "@/components/owner/PageHeader";
import SectionCard from "@/components/owner/menu/SectionCard";
import SectionFormSheet from "@/components/owner/menu/SectionFormSheet";
import ItemFormSheet from "@/components/owner/menu/ItemFormSheet";
import { MdAdd, MdOutlineRestaurantMenu } from "react-icons/md";
import {
  listMenu,
  createSection,
  updateSection,
  deleteSection,
  createItem,
  updateItem,
  deleteItem,
} from "@/lib/menuData.mjs";
import { swapDisplayOrder } from "@/lib/reorder.mjs";

export default function MenuPage() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionSheet, setSectionSheet] = useState(null);
  const [itemSheet, setItemSheet] = useState(null);

  const refresh = useCallback(() => {
    return listMenu()
      .then(setSections)
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  async function handleSaveSection(fields) {
    if (sectionSheet?.id) {
      await updateSection(sectionSheet.id, fields);
    } else {
      await createSection(fields.title, sections.length, fields.badgeText);
    }
    await refresh();
  }

  async function handleDeleteSection() {
    await deleteSection(sectionSheet.id);
    setSectionSheet(null);
    await refresh();
  }

  async function handleMoveSection(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    await swapDisplayOrder("menu_sections", sections[index], sections[target]);
    await refresh();
  }

  async function handleSaveItem(fields) {
    if (itemSheet.item) {
      await updateItem(itemSheet.item.id, fields);
    } else {
      const section = sections.find((s) => s.id === itemSheet.sectionId);
      await createItem(itemSheet.sectionId, fields, section?.items.length ?? 0);
    }
    await refresh();
  }

  async function handleDeleteItem() {
    await deleteItem(itemSheet.item.id, itemSheet.item.imageUrl);
    setItemSheet(null);
    await refresh();
  }

  return (
    <AppShell>
      <Head>
        <title>Menu — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow="Manage" title="Menu" />

      <div className="flex flex-col gap-3 px-5">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Loading menu…</p>
        ) : sections.length === 0 ? (
          <EmptyState
            icon={MdOutlineRestaurantMenu}
            title="No sections yet"
            message="Start with a section like “Starters” or “Mandi”, then add items to it."
          />
        ) : (
          sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              isFirst={index === 0}
              isLast={index === sections.length - 1}
              onEdit={() => setSectionSheet(section)}
              onMoveUp={() => handleMoveSection(index, -1)}
              onMoveDown={() => handleMoveSection(index, 1)}
              onAddItem={() => setItemSheet({ sectionId: section.id, item: null })}
              onEditItem={(item) => setItemSheet({ sectionId: section.id, item })}
            />
          ))
        )}

        <button
          type="button"
          onClick={() => setSectionSheet({})}
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-3 text-sm font-medium text-accent transition-colors active:bg-accent/5"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/12">
            <MdAdd size={16} />
          </span>
          Add section
        </button>
      </div>

      <SectionFormSheet
        isOpen={Boolean(sectionSheet)}
        onClose={() => setSectionSheet(null)}
        initialSection={sectionSheet?.id ? sectionSheet : null}
        onSave={handleSaveSection}
        onDelete={handleDeleteSection}
      />

      <ItemFormSheet
        isOpen={Boolean(itemSheet)}
        onClose={() => setItemSheet(null)}
        initialItem={itemSheet?.item ?? null}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />
    </AppShell>
  );
}
