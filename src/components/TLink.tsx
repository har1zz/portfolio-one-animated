"use client";
import type { ComponentPropsWithRef } from "react";
import { usePageTransition } from "./TransitionProvider";

/** Internal link that plays the pixel wipe. Falls back to a normal link with modifier keys. */
export function TLink({ href, onClick, ...rest }: ComponentPropsWithRef<"a"> & { href: string }) {
  const { navigate } = usePageTransition();
  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
