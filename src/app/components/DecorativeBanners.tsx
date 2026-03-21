import ribbonImage from '../../assets/3b44d4e592504db28abb3282f5b59b8aa8f68a44.png';
export function DecorativeBanners() {
  return (
    <div className="absolute top-0 right-0 w-80 h-80 overflow-hidden pointer-events-none z-0">
      <img
        src={ribbonImage}
        alt="Decorative ribbon"
        className="absolute -top-6 -right-6 w-full h-full object-contain"
      />
    </div>
  );
}
