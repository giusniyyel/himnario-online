import Link from "next/link";
import { appInfo } from "@/lib/app-info";
import { site } from "@/lib/site-metadata";

export function TermsPage() {
  return (
    <div className="space-y-7">
      <header className="space-y-3 py-2">
        <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-[var(--accent)]">
          Términos de uso
        </h1>
        <div className="h-1 w-20 rounded-full bg-[var(--secondary-container)]" />
        <p className="text-sm text-[var(--on-surface-variant)]">
          Última actualización: julio de 2026 · {site.name}
        </p>
      </header>

      <article className="space-y-6 text-sm leading-relaxed text-[var(--on-surface-variant)]">
        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Aceptación</h2>
          <p>
            Al usar {site.name}, aceptas estos términos. Si no estás de acuerdo, por favor no utilices la
            aplicación.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Propósito del servicio</h2>
          <p>
            Esta herramienta digital facilita la consulta del Himnario Rayos de Esperanza para apoyar la
            adoración personal y congregacional en iglesias de la {site.organization}. Ofrece búsqueda,
            lectura, favoritos y uso sin conexión cuando la app está instalada.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Naturaleza del proyecto</h2>
          <p>
            Este es un proyecto comunitario desarrollado para apoyar a iglesias locales. No se presenta como
            un producto oficial de la {site.organization}, salvo que en el futuro exista un respaldo formal
            de su liderazgo.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Contenido del himnario</h2>
          <p>
            Las letras de los himnos pertenecen a sus respectivos titulares de derechos y a la publicación del
            Himnario Rayos de Esperanza. Este sitio los muestra únicamente como ayuda para el culto y el
            estudio congregacional.
          </p>
          <p>No está permitido:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Redistribuir comercialmente el contenido del himnario</li>
            <li>Presentar este sitio como fuente oficial sin autorización</li>
            <li>Modificar las letras y publicarlas como versión autorizada del himnario</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Uso permitido</h2>
          <p>Puedes usar la app para:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Consultar himnos durante el culto o en tu devoción personal</li>
            <li>Guardar favoritos y ajustar preferencias de lectura en tu dispositivo</li>
            <li>Instalarla como aplicación web en tu teléfono o computadora</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Disponibilidad</h2>
          <p>
            El servicio se ofrece “tal cual”, sin garantías de disponibilidad continua. Puede haber
            interrupciones por mantenimiento, actualizaciones o causas fuera de nuestro control.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Limitación de responsabilidad</h2>
          <p>
            Hacemos esfuerzos razonables para mantener el contenido correcto y accesible, pero no garantizamos
            que esté libre de errores tipográficos o diferencias respecto a la edición impresa del himnario.
            El uso de la app es bajo tu propia responsabilidad.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Cambios</h2>
          <p>
            Podemos actualizar estos términos o el funcionamiento de la app. Los cambios relevantes se
            reflejarán en esta página con una fecha de actualización.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Contacto</h2>
          <p>
            Para preguntas sobre estos términos, contacta al desarrollador en{" "}
            <a
              href={appInfo.author.url}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {appInfo.author.displayName}
            </a>
            .
          </p>
        </section>

        <p>
          Consulta también la{" "}
          <Link
            href={appInfo.legal.privacyPath}
            className="font-bold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            política de privacidad
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
