import { useButtonAnimation } from '../hooks/useButtonAnimation';

const AnimatedIconButton = ({
  isActive,
  onClick,
  icon: Icon,
  filledColor,
  label,
  ariaLabel,
}) => {
  const isAnimating = useButtonAnimation(isActive);

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`relative transform transition-transform duration-150 ${
        isAnimating ? 'scale-125' : 'scale-100'
      }`}
    >
      <Icon isActive={isActive} filledColor={filledColor} />
      {isActive && (
        <div
          className="absolute -inset-1 rounded-full animate-pulse"
          style={{
            boxShadow: `0 0 12px ${filledColor}80`,
          }}
        />
      )}
    </button>
  );
};

export default AnimatedIconButton;
