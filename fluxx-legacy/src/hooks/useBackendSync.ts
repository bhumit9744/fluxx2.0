import { useEffect } from "react";
import { useFluxxStore } from "@/store/useFluxxStore";

export function useBackendSync(wsUrl = "ws://localhost:8000/ws") {
  const {
    setIsConnected,
    setDataSource,
    updateTelemetry,
    updateDroneStatus,
    setActiveEvent,
  } = useFluxxStore();

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setDataSource("Live Simulator"); // Assuming simulator by default unless indicated otherwise
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "telemetry") {
            // Update Real-time Telemetry
            if (data.payload) {
              updateTelemetry({
                pm25: data.payload.pm25,
                pm10: data.payload.pm10,
                co2: data.payload.co2,
                temperature: data.payload.temperature,
                humidity: data.payload.humidity,
                wind: data.payload.wind_speed,
                timestamp: data.payload.timestamp,
              });
            }
          } else if (data.type === "drone_status") {
            // Update Drone Status
            if (data.payload) {
              updateDroneStatus({
                altitude: data.payload.altitude,
                speed: data.payload.speed,
                battery: data.payload.battery,
                status: data.payload.status,
              });
            }
          } else if (data.type === "alert" || data.type === "anomaly") {
            // Update Intelligence Event
            setActiveEvent({
              id: data.payload?.id || `evt_${Date.now()}`,
              type: data.payload?.message || "Anomaly Detected",
              confidence: data.payload?.confidence || 85,
              description: data.payload?.description || "Unusual environmental readings detected",
              factors: data.payload?.factors || {},
              active: true,
            });
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setDataSource("Offline");
        // Try to reconnect every 3 seconds
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  }, [
    wsUrl,
    setIsConnected,
    setDataSource,
    updateTelemetry,
    updateDroneStatus,
    setActiveEvent,
  ]);
}
