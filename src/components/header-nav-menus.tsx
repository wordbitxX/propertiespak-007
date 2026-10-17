"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { IconArrowRight, IconChevronDown } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";
import type { NavMenuItem, NavMenuLink } from "@/lib/map-library";

const CLOSE_DELAY = 140;

function isActivePath(pathname: string, href?: string) {
  if (!href) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Desktop header dropdown. Opens on hover, click and keyboard; closes on Escape,
 * outside click, route change and mouse leave. Items with `children` open a flyout.
 */
export function HeaderDropdown({
  label,
  items,
  pathname,
  activePrefix,
  layout = "list",
  footer,
  testId,
}: {
  label: string;
  items: NavMenuItem[];
  pathname: string;
  activePrefix: string;
  layout?: "list" | "grid";
  footer?: NavMenuLink;
  testId?: string;
}) {
  const { t } = useLanguage();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [flyout, setFlyout] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setFlyout(null);
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const show = () => {
    cancelClose();
    setOpen(true);
  };
  const hide = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setFlyout(null);
    }, CLOSE_DELAY);
  };
  const close = () => {
    cancelClose();
    setOpen(false);
    setFlyout(null);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = null;
      setOpen(false);
      setFlyout(null);
    };
    const outside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (flyout) {
        setFlyout(null);
        return;
      }
      close();
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, flyout]);

  const active = isActivePath(pathname, activePrefix);

  return (
    <div
      ref={rootRef}
      className="header-dropdown"
      data-open={open}
      data-testid={testId}
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="nav-link header-dropdown-trigger"
        data-active={active}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            show();
            requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(".header-dropdown-item")?.focus());
          }
        }}
      >
        {t(label)}
        <IconChevronDown className="header-dropdown-chevron h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <div id={menuId} className="header-dropdown-panel" data-layout={layout} hidden={!open}>
        <ul className="header-dropdown-list">
          {items.map((item) => {
            if (item.children?.length) {
              const expanded = flyout === item.label;
              const childActive = item.children.some((child) => isActivePath(pathname, child.href));
              return (
                <li
                  key={item.label}
                  className="header-dropdown-parent"
                  onMouseEnter={() => setFlyout(item.label)}
                  onMouseLeave={() => setFlyout((current) => (current === item.label ? null : current))}
                >
                  <button
                    type="button"
                    className="header-dropdown-item"
                    data-active={childActive}
                    aria-expanded={expanded}
                    onClick={() => setFlyout(expanded ? null : item.label)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                        event.preventDefault();
                        setFlyout(item.label);
                        const host = event.currentTarget.parentElement;
                        requestAnimationFrame(() => host?.querySelector<HTMLElement>(".header-flyout a")?.focus());
                      }
                    }}
                  >
                    <span className="header-dropdown-item-text">
                      <span className="header-dropdown-item-label">{t(item.label)}</span>
                    </span>
                    <IconChevronDown className="header-dropdown-caret h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <ul className="header-flyout" hidden={!expanded}>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="header-dropdown-item"
                          data-active={pathname === child.href}
                          onClick={close}
                        >
                          <span className="header-dropdown-item-label">{t(child.label)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }
            return (
              <li key={item.href ?? item.label} onMouseEnter={() => setFlyout(null)}>
                <Link
                  href={item.href ?? "#"}
                  className="header-dropdown-item"
                  data-active={pathname === item.href}
                  onClick={close}
                >
                  <span className="header-dropdown-item-text">
                    <span className="header-dropdown-item-label">{t(item.label)}</span>
                    {item.description && <span className="header-dropdown-item-desc">{t(item.description)}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {footer && (
          <Link href={footer.href} className="header-dropdown-footer" onClick={close}>
            {t(footer.label)}
            <IconArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

/** Accordion version of a header menu for the mobile navigation drawer. */
export function MobileNavAccordion({
  label,
  items,
  pathname,
  onNavigate,
  footer,
  testId,
}: {
  label: string;
  items: NavMenuItem[];
  pathname: string;
  onNavigate: () => void;
  footer?: NavMenuLink;
  testId?: string;
}) {
  const { t } = useLanguage();
  const panelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-soft" data-testid={testId}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="mobile-nav-link w-full !border-b-0"
      >
        <span>{t(label)}</span>
        <IconChevronDown className={`h-4 w-4 text-[#0E3B2C] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id={panelId} className="mobile-nav-submenu">
          {items.map((item) =>
            item.children?.length ? (
              <div key={item.label} className="mobile-nav-subgroup">
                <p className="mobile-nav-subgroup-title">{t(item.label)}</p>
                <div className="mobile-nav-subgroup-links">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      aria-current={pathname === child.href ? "page" : undefined}
                      className="mobile-nav-sublink"
                    >
                      {t(child.label)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href ?? item.label}
                href={item.href ?? "#"}
                onClick={onNavigate}
                aria-current={pathname === item.href ? "page" : undefined}
                className="mobile-nav-sublink mobile-nav-sublink--row"
              >
                {t(item.label)}
                <IconArrowRight className="h-3.5 w-3.5 shrink-0 text-[#0E3B2C]" aria-hidden="true" />
              </Link>
            ),
          )}
          {footer && (
            <Link href={footer.href} onClick={onNavigate} className="mobile-nav-submenu-footer">
              {t(footer.label)} <IconArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
