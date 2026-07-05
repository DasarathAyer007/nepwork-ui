import { useCallback, useEffect, useState } from 'react';

type GeoPermissionState =
  | 'checking'
  | 'prompt'
  | 'granted'
  | 'denied'
  | 'unsupported';

interface GeoState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  permissionStatus: GeoPermissionState;
}

const INITIAL_STATE: GeoState = {
  lat: null,
  lng: null,
  loading: false,
  error: null,
  permissionStatus: 'checking',
};

function getInitialPermissionStatus(): GeoPermissionState {
  if (!navigator.geolocation) return 'unsupported';
  if (!('permissions' in navigator)) return 'prompt';
  return 'checking';
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>(() => ({
    ...INITIAL_STATE,
    permissionStatus: getInitialPermissionStatus(),
  }));

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        permissionStatus: 'unsupported',
        error: 'Geolocation is not supported by this browser.',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setState((prev) => ({
          ...prev,
          lat: coords.latitude,
          lng: coords.longitude,
          loading: false,
          error: null,
          permissionStatus: 'granted',
        }));
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
          permissionStatus:
            err.code === err.PERMISSION_DENIED
              ? 'denied'
              : prev.permissionStatus,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    if (!navigator.geolocation || !('permissions' in navigator)) {
      // if (!navigator.geolocation) {
      //   setState((prev) => ({
      //     ...prev,
      //     permissionStatus: 'unsupported',
      //   }));
      //   return;
      // }

      // if (!('permissions' in navigator)) {
      //   setState((prev) => ({
      //     ...prev,
      //     permissionStatus: 'prompt',
      //   }));
      return;
    }

    let permission: globalThis.PermissionStatus | null = null;
    let mounted = true;

    const checkPermission = async () => {
      try {
        permission = await navigator.permissions.query({
          name: 'geolocation',
        });

        if (!mounted) return;

        const status = permission.state as GeoPermissionState;

        setState((prev) => ({
          ...prev,
          permissionStatus: status,
        }));

        if (status === 'granted') {
          requestLocation();
        }

        permission.onchange = () => {
          if (!mounted) return;

          const newStatus = permission!.state as GeoPermissionState;

          setState((prev) => ({
            ...prev,
            permissionStatus: newStatus,
          }));

          if (newStatus === 'granted') {
            requestLocation();
          }
        };
      } catch {
        if (!mounted) return;

        // Safari and some browsers don't fully support the Permissions API.
        setState((prev) => ({
          ...prev,
          permissionStatus: 'prompt',
        }));
      }
    };

    void checkPermission();

    return () => {
      mounted = false;

      if (permission) {
        permission.onchange = null;
      }
    };
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
  };
}
