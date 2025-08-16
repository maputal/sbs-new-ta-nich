// Convert UNIX timestamp to "DD Month YYYY HH:MM:SS" (Indonesian month names)
export const toTimeDMYHMS = (unixTimestamp) => {
  const today = new Date(unixTimestamp * 1000);
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  const hh = today.getHours();
  const min = today.getMinutes();
  const sec = today.getSeconds();

  const months = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const paddedDD = dd < 10 ? '0' + dd : dd;
  const paddedMin = min < 10 ? '0' + min : min;
  const paddedSec = sec < 10 ? '0' + sec : sec;

  return `${paddedDD} ${months[mm]} ${yyyy} ${hh}:${paddedMin}:${paddedSec}`;
};

// Convert UNIX timestamp to "DD Month YYYY"
export const toDate = (unixTimestamp) => {
  const today = new Date(unixTimestamp * 1000);
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  const months = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const paddedDD = dd < 10 ? '0' + dd : dd;

  return `${paddedDD} ${months[mm]} ${yyyy}`;
};

// Convert UNIX timestamp to "HH:MM:SS"
export const toTime = (unixTimestamp) => {
  const today = new Date(unixTimestamp * 1000);
  const hh = today.getHours();
  const min = today.getMinutes();
  const sec = today.getSeconds();

  const paddedMin = min < 10 ? '0' + min : min;
  const paddedSec = sec < 10 ? '0' + sec : sec;

  return `${hh}:${paddedMin}:${paddedSec}`;
};

// Convert ISO date string (or JS date string) to UNIX timestamp
export const epoch = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

// Check if a value is a valid UNIX timestamp (between year 2000 and 2100)
export const isEpoch = (value) => {
  const val = Number(value);
  return (
    Number.isInteger(val) &&
    val > 946684800 &&    // Jan 1, 2000
    val < 4102444800      // Jan 1, 2100
  );
}