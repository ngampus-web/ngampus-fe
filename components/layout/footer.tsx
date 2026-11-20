import { Mail, Phone } from "lucide-react"
import Link from "next/link"

import { Logo } from "@/components/layout/logo"
import { footerColumns, type NavLink } from "@/config/navigation"
import { isPathEnabled } from "@/lib/features"
import type { GlobalContent } from "@/lib/api/endpoints/content"

function ContactIcon({ icon }: { icon: NavLink["icon"] }) {
  if (icon === "phone") {
    return <Phone className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
  }

  if (icon === "email") {
    return <Mail className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
  }

  if (icon === "tiktok") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-5 shrink-0"
        fill="currentColor"
        aria-hidden
      >
        <path d="M14.2 3c.4 2.4 1.8 4.1 4.1 4.4v2.8a7 7 0 0 1-4.1-1.3v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.9a2.8 2.8 0 1 0 1.9 2.7V3z" />
      </svg>
    )
  }

  if (icon === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  return null
}

export function Footer({ content }: { content: GlobalContent }) {
  const { footer, contacts } = content
  const address = footer.address.trim()
  const email = [
    "cs@ngampus.co.id",
    "ngampuscs@gmail.com",
    "csngampus@gmail.com",
  ].includes(contacts.email.trim().toLowerCase())
    ? "support@ngampus.co.id"
    : contacts.email.trim()
  const contactsLinks: NavLink[] = [
    {
      label: `+${contacts.whatsapp}`,
      href: `https://wa.me/${contacts.whatsapp}`,
      icon: "phone",
    },
    { label: email, href: `mailto:${email}`, icon: "email" },
    ...(contacts.tiktok
      ? [{ label: "TikTok", href: contacts.tiktok, icon: "tiktok" as const }]
      : []),
    ...(contacts.instagram
      ? [
          {
            label: "Instagram",
            href: contacts.instagram,
            icon: "instagram" as const,
          },
        ]
      : []),
  ]
  // Links into a service an admin switched off are left out.
  const shown = (links: NavLink[]) =>
    links.filter((link) => isPathEnabled(link.href, content.features))
  const columns: {
    title: string
    links: NavLink[]
    body?: string
    contact?: boolean
  }[] = [
    {
      title: footer.menuTitle,
      links: shown(
        footer.menuLinks ?? [...footerColumns[0].links, ...footer.links]
      ),
    },
    {
      title: footer.servicesTitle,
      links: shown(footer.serviceLinks ?? footerColumns[1].links),
    },
    ...(footer.extraSections ?? []).map((section) => ({
      title: section.title,
      links: section.kind === "links" ? shown(section.links) : [],
      body: section.kind === "text" ? section.body.trim() : undefined,
    })),
    { title: footer.contactsTitle, links: contactsLinks, contact: true },
  ]
  return (
    <footer id="kontak" className="bg-surface-footer">
      <div className="mx-auto flex max-w-[1280px] flex-col px-5 py-15 md:px-10">
        <div className="flex flex-col gap-10 xl:flex-row xl:justify-between">
          <div className="flex max-w-[400px] flex-col gap-10">
            <Logo className="h-12" />
            <div className="flex flex-col gap-4">
              <p className="tracking-[-0.02em] text-black">
                {footer.description}
              </p>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-10 sm:grid-cols-[max-content_max-content_minmax(0,1fr)] xl:gap-15">
            {columns.map(
              (column, index) =>
                (column.contact || column.body || column.links.length > 0) && (
                  <div
                    key={index}
                    className={`flex min-w-0 flex-col gap-4 ${column.contact ? "col-span-2 sm:col-span-1" : ""}`}
                  >
                    <p className="font-semibold tracking-[-0.02em] text-black">
                      {column.title}
                    </p>
                    {column.body && (
                      <p className="text-sm leading-6 wrap-break-word whitespace-pre-line text-black">
                        {column.body}
                      </p>
                    )}
                    {column.links.length > 0 && (
                      <ul className="flex flex-col gap-4">
                        {column.links.map((link, i) => {
                          const external = link.href.startsWith("http")
                          return (
                            <li key={i}>
                              <Link
                                href={link.href}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noreferrer" : undefined}
                                className={`inline-flex max-w-full items-center gap-2 tracking-[-0.02em] text-black hover:text-primary ${link.icon === "email" ? "whitespace-nowrap" : "wrap-break-word"}`}
                              >
                                <ContactIcon icon={link.icon} />
                                <span>{link.label}</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {column.contact && contacts.supportHours && (
                      <p className="text-sm text-black">
                        {contacts.supportHours}
                      </p>
                    )}
                    {column.contact && address && (
                      <div className="max-w-[220px] text-black">
                        <p className="font-semibold tracking-[-0.02em]">
                          {footer.addressTitle}
                        </p>
                        <address className="mt-1 text-sm leading-6 tracking-[-0.02em] whitespace-pre-line not-italic">
                          {address}
                        </address>
                      </div>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-center text-sm tracking-[-0.02em] text-black/70">
          Copyright 2026 © Ngampus. All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
