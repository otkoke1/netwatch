export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatBandwidth(bytesPerSecond) {
  if (bytesPerSecond === 0) return '0 Mbps';
  return (bytesPerSecond * 8 / 1024 / 1024).toFixed(2) + ' Mbps';
}