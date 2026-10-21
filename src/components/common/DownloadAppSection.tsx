import React from 'react';
import { DownloadApp, DownloadAppProps } from './DownloadApp';

export { DownloadApp, type DownloadAppProps };

// Compatibility alias for DownloadAppSection
export function DownloadAppSection(props: DownloadAppProps) {
  return <DownloadApp {...props} />;
}
