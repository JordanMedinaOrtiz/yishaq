/**
 * @fileoverview Visor 3D de playera con textura IA + Error Boundary.
 *
 * SOLUCIONES IMPLEMENTADAS contra el crash "Context Lost":
 *
 * 1. **ErrorBoundary**: Clase React que captura excepciones de useLoader
 *    (cuando TextureLoader falla) e impide que el Canvas crashee.
 *    Muestra un fallback visual en lugar de pantalla negra.
 *
 * 2. **Suspense**: Envuelve TShirtModel para manejar la carga asíncrona
 *    de la textura sin que React tire un error no capturado.
 *
 * 3. **Validación de texturaUrl**: El componente NUNCA pasa `null` o
 *    `undefined` a useLoader. Si la URL está vacía, renderiza DefaultScene.
 *
 * 4. **onCreated gl.context recovery**: El Canvas maneja el evento
 *    "webglcontextlost" para prevenir crashes de WebGL.
 *
 * @module components/TShirtViewer3D
 * @author Equipo 6 — Integración SOA + 3D
 */

import { Component, Suspense, useMemo, useRef, useState, useEffect } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import { Loader2, RotateCcw, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

interface TShirtViewer3DProps {
  /** Data URI Base64 de la textura generada por IA, o null */
  texturaUrl: string | null;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════
// ERROR BOUNDARY — Captura crashes de WebGL y useLoader
// ═══════════════════════════════════════════════════════════════

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Callback para reintentar (limpia el error y re-renderiza) */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Error Boundary para el Canvas 3D.
 *
 * Captura las excepciones que THREE.TextureLoader lanza cuando la
 * textura no se puede cargar (403, red, URL inválida, etc.) y
 * previene que el WebGL Context se pierda.
 *
 * Sin este boundary, un error en useLoader burbujea hasta el Canvas,
 * que destruye el contexto WebGL y deja la pantalla negra permanente.
 */
class Canvas3DErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || "Error desconocido en el visor 3D",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[Canvas3DErrorBoundary] Error capturado:", error);
    console.error("[Canvas3DErrorBoundary] Component stack:", errorInfo.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: "" });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Error en el visor 3D
          </p>
          <p className="text-xs text-muted-foreground max-w-xs mb-4">
            {this.state.errorMessage}
          </p>
          <button
            onClick={this.handleReset}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
              "bg-secondary text-foreground",
              "border border-border/50",
              "hover:bg-secondary/80 transition-colors"
            )}
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════
// MODELO 3D DE LA PLAYERA CON TEXTURA IA
// ═══════════════════════════════════════════════════════════════

/**
 * ── MODELO 3D REAL: playera cargada desde /public/t-shirt.glb ──
 *
 * FLUJO DE CARGA EN DOS ETAPAS:
 *
 * ETAPA 1 — useGLTF('/t-shirt.glb'):
 *   Hook de @react-three/drei que usa internamente useLoader(GLTFLoader).
 *   Suspende el render de React mientras el archivo .glb se descarga.
 *   El <Suspense fallback={<LoadingFallback3D />}> del padre captura esa
 *   suspensión. Una vez descargado, el modelo queda en caché: llamadas
 *   posteriores son instantáneas.
 *
 * ETAPA 2 — TextureLoader.load() imperativo:
 *   La textura Base64 de la IA se carga sin useLoader para no lanzar
 *   excepciones. Los errores llegan al 4° argumento (callback onError).
 *
 * APLICACIÓN DE TEXTURA AL GRAFO DE ESCENA (scene.traverse):
 *   Un archivo GLTF es un árbol de nodos THREE.Object3D. Los THREE.Mesh
 *   son las hojas con geometría + material. scene.traverse() recorre ese
 *   árbol completo y reemplaza el `map` (canal difuso) de cada
 *   MeshStandardMaterial — sin necesidad de conocer los nombres exactos
 *   de las mallas dentro del .glb.
 *
 * DEPURACIÓN DE NODOS:
 *   Abre la consola del navegador y busca los logs "[TShirtModel] Nodo →".
 *   Verás el nombre de cada THREE.Mesh del modelo. Si la playera tiene
 *   partes separadas (cuerpo, mangas, cuello), puedes filtrar por nombre
 *   para aplicar la textura solo a las mallas que te interesen.
 */
function TShirtModel({ texturaUrl }: { texturaUrl: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadError, setLoadError] = useState(false);

  // ── ETAPA 1: Carga del modelo GLB ────────────────────────────────────────
  // useGLTF suspende el componente mientras el .glb se descarga de /public.
  // El <Suspense> padre muestra LoadingFallback3D durante ese tiempo.
  const { scene } = useGLTF("/t-shirt.glb");

  /**
   * Clon profundo de la escena GLTF con materiales propios por instancia.
   *
   * PORQUÉ CLONAMOS:
   *   useGLTF cachea el objeto `scene`. Si mutáramos `scene` directamente,
   *   afectaríamos todas las instancias futuras del componente y al caché.
   *   Al clonar, cada montaje de TShirtModel tiene su propio subárbol 3D.
   *
   * scene.clone(true):
   *   - true = clon recursivo (clona toda la jerarquía de Object3D)
   *   - Las geometrías se comparten (son read-only, es seguro)
   *   - Los materiales NO se clonan automáticamente → los clonamos en traverse
   *     para poder mutar .map sin contaminar la caché de useGLTF.
   */
  const scenaClonada = useMemo(() => {
    const clon = scene.clone(true);

    // Recorremos el DOM 3D para clonar cada material individualmente.
    // Así las mutaciones de .map quedan aisladas a esta instancia.
    clon.traverse((nodo) => {
      if (nodo instanceof THREE.Mesh && nodo.material) {
        nodo.material = Array.isArray(nodo.material)
          ? nodo.material.map((m: THREE.Material) => m.clone())
          : (nodo.material as THREE.Material).clone();
      }
    });

    return clon;
  }, [scene]);

  // ── ETAPA 2: Carga imperativa de la textura IA ───────────────────────────
  // TextureLoader.load() nunca lanza — los errores van al callback onError.
  useEffect(() => {
    if (!texturaUrl) return;
    setTexture(null);
    setLoadError(false);

    const loader = new THREE.TextureLoader();
    loader.load(
      texturaUrl,
      (tex) => {
        /**
         * AJUSTES CRÍTICOS para texturas sobre modelos GLTF:
         *
         * flipY = false
         *   GLTF exporta las UVs con el eje Y invertido respecto a
         *   Three.js. Sin esto la textura aparece al revés.
         *
         * colorSpace = SRGBColorSpace
         *   Activa corrección gamma correcta en el pipeline PBR.
         *
         * wrapS / wrapT = RepeatWrapping
         *   Define cómo se comporta la textura fuera del rango [0,1]
         *   de las UVs. RepeatWrapping la repite en teselas.
         *
         * repeat.set(1, 1)
         *   1 repetición = la imagen cubre TODA la superficie de la malla.
         *   Aumenta este valor si quieres que el gráfico aparezca más
         *   pequeño y repetido (ej. repeat.set(2, 2) → 4 copias en rejilla).
         *   Disminúyelo (ej. 0.5) si quieres que el gráfico se agrande
         *   y cubra más área del pecho.
         */
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1); // ← ajusta aquí la escala del gráfico sobre la camisa
        tex.anisotropy = 16;
        tex.needsUpdate = true;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("[TShirtModel] Error al cargar textura IA:", err);
        setLoadError(true);
      }
    );
  }, [texturaUrl]);

  /**
   * INYECCIÓN DE TEXTURA EN EL GRAFO DE ESCENA.
   *
   * scene.traverse(callback) visita TODOS los nodos del árbol 3D en orden
   * depth-first: Groups, Meshes, Lights, Cameras, etc.
   *
   * Filtramos por `instanceof THREE.Mesh` (también captura SkinnedMesh,
   * que hereda de Mesh) para tocar sólo la geometría visible.
   *
   * En cada malla, sustituimos `material.map` (textura difusa/albedo) por
   * la imagen generada por la IA. El log de consola permite identificar
   * el nombre exacto de cada malla — útil para modelos con múltiples partes.
   */
  useEffect(() => {
    if (!texture) return;

    /**
     * BUG "TEXTURA EN BLANCO" — causa raíz y solución:
     *
     * El enfoque anterior comprobaba `instanceof THREE.MeshStandardMaterial`
     * antes de asignar `.map`. Si el material original del .glb era de otro
     * tipo (MeshBasicMaterial, MeshPhongMaterial, etc.), la condición fallaba
     * silenciosamente y el mapa de textura nunca se asignaba — resultado:
     * el modelo renderizaba su color base (blanco) sin imagen.
     *
     * SOLUCIÓN: crear un MeshStandardMaterial NUEVO para cada malla.
     * Esto garantiza el tipo correcto independientemente del material
     * original, y configura todas las propiedades PBR de golpe.
     * roughness=0.8 simula la rugosidad de la tela (sin brillos plásticos).
     */
    scenaClonada.traverse((nodo) => {
      if (nodo instanceof THREE.Mesh) {
        console.log(
          `[TShirtModel] Aplicando textura → nodo: "${nodo.name}"`,
          `| geometría: ${nodo.geometry.type}`
        );

        nodo.material = new THREE.MeshStandardMaterial({
          map: texture,
          // BLANCO PURO: sin esto el color base del .glb se multiplica
          // con la textura, tiñendo la imagen y haciéndola aparecer como
          // un tinte sólido en vez de un gráfico detallado.
          color: new THREE.Color("#ffffff"),
          roughness: 0.8,
          metalness: 0.0,
          envMapIntensity: 0.5,
        });
        nodo.material.needsUpdate = true;
      }
    });
  }, [texture, scenaClonada]);

  // ── Rotación suave automática ──
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  // Si la textura falló → la playera sigue visible, sin la imagen IA
  if (loadError) return <DefaultScene />;

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.02 : 1.0}
    >
      {/**
       * <Center> de @react-three/drei calcula el bounding box de su hijo
       * y lo reposiciona para que su centro quede exactamente en [0,0,0].
       * Esto compensa cualquier pivote (origin) descentrado del .glb,
       * causa habitual del modelo "lejos" o "cortado" en pantalla.
       *
       * <primitive object={scenaClonada} /> monta el árbol THREE.js del
       * GLTF directamente en la escena R3F. Animaciones, rigs y morph
       * targets del archivo quedan activos automáticamente.
       */}
      <Center>
        <primitive object={scenaClonada} />
      </Center>

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.45}
        scale={6}
        blur={2.5}
        far={4}
      />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// FALLBACKS
// ═══════════════════════════════════════════════════════════════

/** Spinner 3D que se muestra mientras useLoader descarga la textura */
function LoadingFallback3D() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[0.5, 0.05, 16, 64]} />
      <meshStandardMaterial
        color="#4ade80"
        emissive="#4ade80"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

/**
 * Escena por defecto (sin textura IA) — usa el mismo modelo GLB real.
 *
 * Aplica un MeshStandardMaterial oscuro a todas las mallas para mostrar
 * la silueta realista de la playera mientras el usuario no ha generado
 * ningún diseño. Así el usuario ve la forma correcta del modelo desde
 * el primer momento.
 */
function DefaultScene() {
  const groupRef = useRef<THREE.Group>(null);

  // Mismo modelo, misma estrategia de clon con materiales independientes
  const { scene } = useGLTF("/t-shirt.glb");
  const scenaClonada = useMemo(() => {
    const clon = scene.clone(true);

    // Reemplazamos todos los materiales con uno oscuro y mate
    clon.traverse((nodo) => {
      if (nodo instanceof THREE.Mesh) {
        nodo.material = new THREE.MeshStandardMaterial({
          color: "#1a1a2e",
          roughness: 0.9,
          metalness: 0.0,
          envMapIntensity: 0.2,
        });
      }
    });

    return clon;
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scenaClonada} />
      </Center>
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.3}
        scale={6}
        blur={2.5}
        far={4}
      />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PÚBLICO: TShirtViewer3D
// ═══════════════════════════════════════════════════════════════

/**
 * Visor 3D completo con Canvas, iluminación, controles orbitales,
 * Error Boundary y Suspense.
 *
 * Cadena de protección contra crashes:
 * ```
 * <Canvas onCreated={handleContextLoss}>
 *   <Canvas3DErrorBoundary>        ← Captura errores de useLoader
 *     <Suspense fallback={...}>    ← Maneja la carga asíncrona
 *       <TShirtModel />            ← useLoader(TextureLoader, dataUri)
 *     </Suspense>
 *   </Canvas3DErrorBoundary>
 * </Canvas>
 * ```
 */
export function TShirtViewer3D({ texturaUrl, className }: TShirtViewer3DProps) {
  const [errorBoundaryKey, setErrorBoundaryKey] = useState(0);

  /**
   * Resetea el Error Boundary incrementando su key.
   * Esto fuerza a React a destruir y re-crear el boundary,
   * limpiando el estado de error.
   */
  const handleErrorReset = () => {
    setErrorBoundaryKey((prev) => prev + 1);
  };

  return (
    // ErrorBoundary FUERA del Canvas: su fallback HTML se renderiza
    // correctamente y rescata el visor si WebGL colapsa de forma inesperada.
    <Canvas3DErrorBoundary key={errorBoundaryKey} onReset={handleErrorReset}>
    <div
      className={cn(
        "relative w-full h-full min-h-[400px] rounded-xl overflow-hidden",
        "bg-linear-to-b from-[#0a0a1a] to-[#111128]",
        "border border-border/30",
        className
      )}
    >
      <Canvas
        camera={{ position: [0, 0, 2], fov: 45, near: 0.01 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          // Permitir que WebGL intente preservar el contexto
          powerPreference: "default",
        }}
        dpr={[1, 2]}
        // ── Manejar pérdida de contexto WebGL ──
        onCreated={({ gl }) => {
          const canvas = gl.domElement;

          canvas.addEventListener("webglcontextlost", (event) => {
            event.preventDefault(); // Evita que el navegador destruya el canvas
            console.warn("[TShirtViewer3D] WebGL context lost — prevenido");
          });

          canvas.addEventListener("webglcontextrestored", () => {
            console.info("[TShirtViewer3D] WebGL context restaurado");
          });
        }}
      >
        {/* ── Iluminación ── */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#4ade80" />

        {/* ── Entorno HDR ── */}
        <Environment preset="city" />

        {/**
         * <Suspense> es OBLIGATORIO aquí porque useGLTF() suspende el render
         * mientras el archivo .glb se descarga de /public. El fallback es
         * un spinner 3D (no HTML) — funciona dentro del reconciliador de R3F.
         * Una vez cacheado, los cambios entre TShirtModel y DefaultScene
         * son instantáneos sin volver a suspender.
         */}
        <Suspense fallback={<LoadingFallback3D />}>
          {texturaUrl ? (
            <TShirtModel texturaUrl={texturaUrl} />
          ) : (
            <DefaultScene />
          )}
        </Suspense>

        {/* ── Controles orbitales ── */}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={0.5}
          maxDistance={7}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.7}
          autoRotate={false}
        />
      </Canvas>

      {/* ── Overlay de instrucciones ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm border border-border/30 text-xs text-muted-foreground/60 pointer-events-none">
        <RotateCcw className="w-3 h-3" />
        Arrastra para rotar
      </div>

      {/* ── Badge de estado ── */}
      {texturaUrl && (
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          ✦ Textura IA aplicada
        </div>
      )}
    </div>    </Canvas3DErrorBoundary>  );
}

// ═══════════════════════════════════════════════════════════════
// SSR WRAPPER — Seguro para Astro (server-side rendering)
// ═══════════════════════════════════════════════════════════════

/**
 * Wrapper SSR-safe para el visor 3D.
 * Three.js necesita WebGL (solo navegador). Este wrapper detecta
 * `isMounted` para renderizar el Canvas solo client-side.
 */
export function TShirtViewerSSR(props: TShirtViewer3DProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center min-h-[400px] rounded-xl",
          "bg-linear-to-b from-[#0a0a1a] to-[#111128]",
          "border border-border/30",
          props.className
        )}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Cargando visor 3D...</p>
        </div>
      </div>
    );
  }

  return <TShirtViewer3D {...props} />;
}

// ─────────────────────────────────────────────────────────────
// PRELOAD DEL MODELO GLB — nivel de módulo
// ─────────────────────────────────────────────────────────────
/**
 * useGLTF.preload inicia la descarga de t-shirt.glb en cuanto este
 * módulo es importado por el bundle — ANTES de que el usuario llegue
 * a la pantalla del generador. Cuando el Canvas monta el modelo, el
 * archivo ya está en caché y useGLTF no necesita suspender.
 *
 * Se ejecuta una sola vez al cargar el bundle (nivel de módulo).
 */
useGLTF.preload("/t-shirt.glb");
