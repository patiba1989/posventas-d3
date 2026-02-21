"use client"

import { useState, Fragment } from "react"
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, Transition } from "@headlessui/react"
import { cn } from "@/lib/utils"

interface Option {
  id: number | string
  nombre: string
}

interface SearchableSelectProps {
  options: Option[]
  value: number | string | null
  onChange: (value: number | string | null) => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccione una opción",
  disabled = false,
  isLoading = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("")

  const selectedOption = options.find((o) => o.id === value) || null

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.nombre.toLowerCase().includes(query.toLowerCase())
        )

  return (
    <Combobox
      value={selectedOption}
      onChange={(opt) => onChange(opt?.id ?? null)}
      disabled={disabled}
    >
      <div className="relative">
        <ComboboxInput
          className={cn(
            "w-full rounded border border-[#bbb] px-3 py-2.5 text-sm text-[#333] bg-white pr-10",
            "focus:border-[#434E72] focus:outline-none focus:ring-2 focus:ring-[#434E72]/20",
            "placeholder:text-[#999] transition-colors duration-200",
            "disabled:bg-[#f5f5f5] disabled:text-[#999] disabled:cursor-not-allowed"
          )}
          displayValue={(option: Option | null) => option?.nombre ?? ""}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isLoading ? "Cargando..." : placeholder}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-[#666]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </ComboboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <ComboboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-sm shadow-lg border border-[#ddd] focus:outline-none">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-[#999]">
                {query ? "Sin resultados" : "No hay opciones"}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <ComboboxOption
                  key={option.id}
                  value={option}
                  className={({ focus }) =>
                    cn(
                      "relative cursor-pointer select-none py-2 px-4",
                      focus ? "bg-[#434E72] text-white" : "text-[#333]"
                    )
                  }
                >
                  {({ selected }) => (
                    <span className={cn("block truncate", selected && "font-semibold")}>
                      {option.nombre}
                    </span>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  )
}
