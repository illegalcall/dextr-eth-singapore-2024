import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownItem {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  placeholder: string;
  label?: string;
  value: string; // Add the value prop
  onChange: (value: string) => void;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder,
  value, // Add the value prop
  onChange,
  className = "",
}) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger
        className={`min-w-[180px] flex items-center justify-between border border-primary rounded-md shadow-md p-2 transition duration-200 cursor-pointer ${className}`}
      >
        <SelectValue placeholder={placeholder} />
        {/* Optional icon for dropdown indication */}
      </SelectTrigger>
      <SelectContent className="bg-white shadow-lg rounded-md mt-1">
        <SelectGroup>
          {/* <SelectLabel>{label}</SelectLabel> */}
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomDropdown;
