// Helper functions for room filter display and conversion

export const normalizeRoomValue = (value: string | string[]): string => {
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any';
    if (value.length === 1) return value[0];
    return value.join(',');
  }
  return value || 'any';
};

export const getRoomDisplayText = (value: string | string[], options: { value: string; label: string }[]): string => {
  if (Array.isArray(value)) {
    if (value.length === 0) return 'All';
    if (value.length === 1) {
      const option = options.find(opt => opt.value === value[0]);
      return option ? option.label : value[0];
    }
    // For multiple selections, show the labels
    const labels = value.map(v => {
      const option = options.find(opt => opt.value === v);
      return option ? option.label : v;
    });
    return labels.join(', ');
  }
  
  if (!value || value === 'any') return 'All';
  
  // Handle comma-separated string values (multiple selection stored as string)
  if (value.includes(',')) {
    const values = value.split(',').filter(Boolean);
    const labels = values.map(v => {
      const option = options.find(opt => opt.value === v);
      return option ? option.label : v;
    });
    return labels.join(', ');
  }
  
  const option = options.find(opt => opt.value === value);
  return option ? option.label : value;
};

export const convertToStringArray = (value: string | string[]): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value !== 'any') {
    return value.split(',').filter(Boolean);
  }
  return [];
};