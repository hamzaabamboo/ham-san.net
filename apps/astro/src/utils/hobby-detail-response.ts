type HobbyDetailResponseInput = {
  settingsAvailable: boolean;
  documentStatus?: number;
  hasDocument?: boolean;
  childDocumentsUnavailable?: boolean;
};

const unavailable = {
  status: 503,
  cacheControl: 'no-store',
  redirectTo404: false
} as const;

export const getHobbyDetailResponse = ({
  settingsAvailable,
  documentStatus,
  hasDocument = false,
  childDocumentsUnavailable = false
}: HobbyDetailResponseInput) => {
  if (!settingsAvailable) return unavailable;
  if (documentStatus === 404) {
    return { status: 404, cacheControl: 'no-store', redirectTo404: true } as const;
  }
  if (!documentStatus || documentStatus < 200 || documentStatus >= 300 || !hasDocument) {
    return unavailable;
  }
  if (childDocumentsUnavailable) return unavailable;
  return {
    status: 200,
    cacheControl: 'public, max-age=86400, must-revalidate',
    redirectTo404: false
  } as const;
};
