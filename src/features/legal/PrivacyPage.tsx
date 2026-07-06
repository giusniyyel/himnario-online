import Link from "next/link";
import { appInfo } from "@/lib/app-info";
import { site } from "@/lib/site-metadata";

export function PrivacyPage() {
  return (
    <div className="space-y-7">
      <header className="space-y-3 py-2">
        <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-[var(--accent)]">
          Política de privacidad
        </h1>
        <div className="h-1 w-20 rounded-full bg-[var(--secondary-container)]" />
        <p className="text-sm text-[var(--on-surface-variant)]">
          Última actualización: julio de 2026 · {site.name}
        </p>
      </header>

      <article className="space-y-6 text-sm leading-relaxed text-[var(--on-surface-variant)]">
        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Resumen</h2>
          <p>
            {site.name} está diseñado para uso personal y congregacional. No requiere cuenta, no pide datos
            personales y no envía tu información a servidores propios para crear un perfil de usuario.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Datos que se guardan en tu dispositivo</h2>
          <p>Para mejorar tu experiencia, la app puede guardar localmente en tu navegador:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Himnos marcados como favoritos</li>
            <li>Himnos visitados recientemente</li>
            <li>Preferencias de lectura (tamaño de texto, tema y alineación)</li>
          </ul>
          <p>
            Esta información permanece en tu dispositivo mediante almacenamiento local del navegador. Puedes
            eliminarla borrando los datos del sitio en la configuración de tu navegador.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Datos que no recopilamos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nombre, correo electrónico u otros datos de identificación</li>
            <li>Ubicación</li>
            <li>Historial de búsqueda enviado a un servidor propio</li>
            <li>Cuentas de usuario ni contraseñas</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Servicios de terceros</h2>
          <p>
            Si accedes al sitio a través de un proveedor de hospedaje o red, ese proveedor puede registrar
            datos técnicos habituales de conexión (por ejemplo, dirección IP o tipo de navegador) conforme a
            sus propias políticas. Este proyecto no usa herramientas de analítica propias para rastrear tu
            actividad dentro de la app.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Menores de edad</h2>
          <p>
            La app no está dirigida a recopilar información personal de menores. Al no solicitar datos
            personales, no creamos perfiles de usuarios de ninguna edad.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política si cambia el funcionamiento de la app. La fecha de actualización
            al inicio de esta página indicará la versión vigente.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-[var(--on-surface)]">Contacto</h2>
          <p>
            Para dudas sobre privacidad, puedes contactar al desarrollador en{" "}
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
          Consulta también los{" "}
          <Link href={appInfo.legal.termsPath} className="font-bold text-[var(--accent)] underline-offset-4 hover:underline">
            términos de uso
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
