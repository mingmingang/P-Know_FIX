import Icon from "./Icon";
import "../../style/Button.css";

export default function Button({
  classType,
  iconName,
  label = "",
  title = "",
  type = "button",
  isDisabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className="custom-button add-button"
      {...props}
      title={title}
      disabled={isDisabled}
    >
      {iconName && (
        <Icon name={iconName} cssClass={label === "" ? undefined : "pe-2"} style={{marginTop:"5px"}}/>
      )}
      {label}
    </button>
  );
}
