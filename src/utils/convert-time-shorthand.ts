// utils/convertTimeShorthand.ts
export const convertTimeShorthand = (time: string): string => {
   const timeUnits: { [key: string]: string } = {
       h: 'hour',
       min: 'minute',
       s: 'second',
   };

   const regex = /(\d+)(h|min|s)/g;
   const matches = [...time.matchAll(regex)];

   const convertedTime = matches.map(([_, value, unit]) => {
       const unitFullName = timeUnits[unit] || unit;
       const pluralizedUnit = Number(value) > 1 ? `${unitFullName}s` : unitFullName;
       return `${value} ${pluralizedUnit}`;
   });

   return convertedTime.join(', ');
};
