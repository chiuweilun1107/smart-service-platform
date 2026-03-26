import L from 'leaflet';

// Create a custom DivIcon with Tailwind classes
export const createMapIcon = (color: 'red' | 'orange' | 'blue' | 'green', size: number = 24) => {
    const colorMap = {
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        blue: 'bg-primary-600',
        green: 'bg-green-500',
    };

    const html = `
    <div class="relative flex items-center justify-center w-full h-full">
      <div class="absolute w-full h-full ${colorMap[color]} rounded-full opacity-30 animate-ping"></div>
      <div class="relative w-3/4 h-3/4 ${colorMap[color]} rounded-full shadow-lg border-2 border-white"></div>
    </div>
  `;

    return L.divIcon({
        className: 'custom-map-icon', // Use custom class to remove default styles if needed
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2], // Center anchor
    });
};
