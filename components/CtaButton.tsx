"use client";

import { useModal } from "./ModalContext";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function CtaButton({ children, className = "btn btn-dark", style }: Props) {
  const { open } = useModal();
  return (
    <button className={className} style={style} onClick={open}>
      {children}
    </button>
  );
}
