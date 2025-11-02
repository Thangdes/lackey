"use client";

import CartMiniClient from "./CartMiniClient";
import CartClientFull from "./CartClientFull";

type CartClientProps = {
  mode?: 'full' | 'mini'
  hideMiniAction?: boolean
  forceHighlightSku?: string
}

export default function CartClient({ mode = 'full', hideMiniAction, forceHighlightSku }: CartClientProps) {
  if (mode === 'mini') {
    return <CartMiniClient hideMiniAction={hideMiniAction} highlightSku={forceHighlightSku} />;
  }
  return <CartClientFull forceHighlightSku={forceHighlightSku} />;
}
