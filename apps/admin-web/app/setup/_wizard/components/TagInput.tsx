"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  id: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function TagInput({
  id,
  values,
  onChange,
  placeholder,
  suggestions = [],
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const v = raw.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setDraft("");
  };

  const remove = (v: string) => onChange(values.filter((t) => t !== v));

  return (
    <div className="es-taginput">
      <div className="es-taginput-row">
        <input
          id={id}
          className="es-input"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            }
          }}
        />
        <button
          type="button"
          className="es-btn es-btn--secondary es-btn--sm"
          onClick={() => add(draft)}
          aria-label="Ajouter"
        >
          <Plus className="w-4 h-4" aria-hidden />
        </button>
      </div>

      {suggestions.filter((s) => !values.includes(s)).length > 0 && (
        <div className="es-taginput-suggestions">
          {suggestions
            .filter((s) => !values.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                className="es-chip es-chip--ghost"
                onClick={() => add(s)}
              >
                <Plus className="w-3 h-3" aria-hidden /> {s}
              </button>
            ))}
        </div>
      )}

      {values.length > 0 && (
        <div className="es-taginput-tags">
          {values.map((v) => (
            <span key={v} className="es-chip">
              {v}
              <button
                type="button"
                className="es-chip-remove"
                onClick={() => remove(v)}
                aria-label={`Retirer ${v}`}
              >
                <X className="w-3 h-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
