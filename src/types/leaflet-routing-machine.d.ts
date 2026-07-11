// Minimal ambient types for the parts of leaflet-routing-machine this app
// uses. We deliberately only type the *headless* router API (L.Routing.osrmv1
// + .route()) — we never mount L.Routing.control, so its (much larger,
// UI-related) surface isn't declared here.
import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    interface IRouteSummary {
      totalDistance: number; // meters
      totalTime: number; // seconds
    }

    interface IInstruction {
      text: string;
      distance: number;
      time: number;
      type: string;
    }

    interface IRoute {
      name: string;
      coordinates: L.LatLng[];
      summary: IRouteSummary;
      instructions: IInstruction[];
      waypoints: L.LatLng[];
    }

    class Waypoint {
      constructor(latLng: L.LatLng, name?: string, options?: unknown);
      latLng: L.LatLng;
    }

    function waypoint(
      latLng: L.LatLng,
      name?: string,
      options?: unknown
    ): Waypoint;

    interface IOSRMV1Options {
      serviceUrl?: string;
      profile?: string;
      useHints?: boolean;
      language?: string;
    }

    interface IRouter {
      route(
        waypoints: Waypoint[],
        callback: (
          error: { status?: number; message?: string } | null,
          routes?: IRoute[]
        ) => void
      ): void;
    }

    function osrmv1(options?: IOSRMV1Options): IRouter;
  }
}

export {};
