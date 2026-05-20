import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { TerminalButton } from "./TerminalButton";

type CommandInputProps = {
  onSubmit: (command: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function CommandInput({ onSubmit, placeholder = "/msg encrypted hello", disabled = false }: CommandInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = value.trim();
    if (!command) {
      return;
    }
    onSubmit(command);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-terminal/25 bg-void/90 p-2.5 sm:p-3">
      <label className="sr-only" htmlFor="command-input">
        Terminal command
      </label>
      <span className="select-none pt-3 text-cyanwire">$</span>
      <input
        id="command-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="min-w-0 flex-1 border border-terminal/30 bg-black/65 px-3 py-2 text-sm text-terminal outline-none transition duration-200 placeholder:text-emerald-200/35 focus:border-cyanwire focus:shadow-focusRing"
        autoComplete="off"
      />
      <TerminalButton type="submit" className="min-w-11 px-3" disabled={disabled} aria-label="Send command">
        <Send size={16} />
      </TerminalButton>
    </form>
  );
}
