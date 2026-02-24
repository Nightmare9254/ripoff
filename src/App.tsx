import { useState, useRef, useEffect, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

type AppState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "scanning" }
  | { status: "success"; content: string; lat: number; lng: number }
  | { status: "error"; message: string };

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function App() {
  const [state, setState] = useState<AppState>({ status: "idle" });
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scannerContainerId = "qr-reader";
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (e) {
        console.error("Error stopping scanner:", e);
      }
    }
  }, []);

  const checkAndRequestLocation = async () => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    await new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  };

  const handleStartScan = async () => {
    setState({
      status: "loading",
      message: "Requesting location permission...",
    });

    try {
      await checkAndRequestLocation();

      setState({ status: "loading", message: "Starting camera..." });
      startScanner();
    } catch (error) {
      const geolocationError = error as GeolocationPositionError;
      let errorMessage = "Failed to get location";

      if (error instanceof Error && error.message === "denied") {
        errorMessage =
          "Location permission was denied. Please enable location access in your browser settings, then return and try again.";
      } else if (
        geolocationError?.code === GeolocationPositionError.PERMISSION_DENIED
      ) {
        errorMessage =
          "Location permission denied. Please enable location access and try again.";
      } else if (
        geolocationError?.code === GeolocationPositionError.POSITION_UNAVAILABLE
      ) {
        errorMessage = "Location information unavailable. Please try again.";
      } else if (geolocationError?.code === GeolocationPositionError.TIMEOUT) {
        errorMessage = "Location request timed out. Please try again.";
      } else if (
        error instanceof Error &&
        error.message.includes("not supported")
      ) {
        errorMessage = error.message;
      }

      setState({ status: "error", message: errorMessage });
    }
  };

  const startScanner = async () => {
    setState({ status: "scanning" });
  };

  const runScanner = useCallback(async () => {
    const element = document.getElementById(scannerContainerId);
    if (!element) {
      setTimeout(runScanner, 100);
      return;
    }

    const scanner = new Html5Qrcode(scannerContainerId);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopScanner();
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setState({
                status: "success",
                content: decodedText,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => {
              setState({
                status: "success",
                content: decodedText,
                lat: 0,
                lng: 0,
              });
            },
          );
        },
        () => {},
      );
    } catch (error) {
      setState({
        status: "error",
        message:
          "Failed to start camera. Please ensure camera permission is granted.",
      });
    }
  }, [stopScanner]);

  useEffect(() => {
    if (state.status === "scanning") {
      runScanner();
    }
  }, [state.status, runScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleReset = () => {
    setState({ status: "idle" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1 style={{ marginBottom: "40px", color: "#333", textAlign: "center" }}>
        QR Scanner
      </h1>

      {state.status === "idle" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={handleStartScan}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              padding: "20px 40px",
              fontSize: "18px",
              backgroundColor: isHovered ? "#0056b3" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            Scan QR Code
          </button>

          {deferredPrompt && (
            <button
              type="button"
              onClick={handleInstall}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                fontSize: "14px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Install App
            </button>
          )}
        </div>
      )}

      {state.status === "loading" && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #007bff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "#666" }}>{state.message}</p>
        </div>
      )}

      {state.status === "scanning" && (
        <div
          id={scannerContainerId}
          style={{ width: "100%", maxWidth: "400px" }}
        />
      )}

      {state.status === "error" && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#ffebee",
            border: "1px solid #ffcdd2",
            borderRadius: "8px",
            color: "#c62828",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: "20px" }}>{state.message}</p>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {state.status === "success" && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#e8f5e9",
            border: "1px solid #c8e6c9",
            borderRadius: "8px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#2e7d32", marginBottom: "15px" }}>
            Scanned Content:
          </h3>
          <p
            style={{
              wordBreak: "break-all",
              color: "#333",
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "4px",
            }}
          >
            {state.content}
          </p>
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "white",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#333",
            }}
          >
            <strong>Location:</strong>
            <br />
            {state.lat === 0 && state.lng === 0 ? (
              "Unable to get location"
            ) : (
              <>
                Lat: {state.lat.toFixed(6)}
                <br />
                Lng: {state.lng.toFixed(6)}
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleReset}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Scan Another
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
