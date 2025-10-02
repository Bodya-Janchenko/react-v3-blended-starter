import css from "./SearchBox.module.css";

interface SearchBoxProps {
  setSearchQuery: (query: string) => void;
}

export default function SearchBox({ setSearchQuery }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search posts"
      onChange={(event) => {
        setSearchQuery(event.currentTarget.value);
      }}
    />
  );
}
