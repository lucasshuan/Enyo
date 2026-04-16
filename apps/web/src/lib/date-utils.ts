export function formatDate(
  date: Date | string | number,
  locale: string = "pt-BR",
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  },
) {
  try {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    return new Intl.DateTimeFormat(locale.replace("_", "-"), options).format(
      dateObj,
    );
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
}

export function formatTime(
  date: Date | string | number,
  locale: string = "pt-BR",
) {
  return formatDate(date, locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(
  date: Date | string | number,
  locale: string = "pt-BR",
) {
  return formatDate(date, locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatHoursDuration(
  totalHours: number,
  locale: string = "pt-BR",
) {
  const normalizedLocale = locale.replace("_", "-");
  const safeTotalHours = Math.max(0, Math.floor(totalHours));
  const hoursPerDay = 24;
  const hoursPerWeek = hoursPerDay * 7;

  const weeks = Math.floor(safeTotalHours / hoursPerWeek);
  const days = Math.floor((safeTotalHours % hoursPerWeek) / hoursPerDay);
  const hours = safeTotalHours % hoursPerDay;

  const formatUnit = (value: number, unit: "week" | "day" | "hour") =>
    new Intl.NumberFormat(normalizedLocale, {
      style: "unit",
      unit,
      unitDisplay: "long",
      maximumFractionDigits: 0,
    }).format(value);

  const parts = [
    weeks > 0 ? formatUnit(weeks, "week") : null,
    days > 0 ? formatUnit(days, "day") : null,
    hours > 0 ? formatUnit(hours, "hour") : null,
  ].filter((part): part is string => Boolean(part));

  if (parts.length === 0) {
    return formatUnit(0, "hour");
  }

  return new Intl.ListFormat(normalizedLocale, {
    style: "long",
    type: "conjunction",
  }).format(parts);
}
