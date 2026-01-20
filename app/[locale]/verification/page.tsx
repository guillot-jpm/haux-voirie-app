"use client";

import { RejectionDialog } from "@/components/RejectionDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function VerificationPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <RejectionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={() => {}}
      />
    </div>
  );
}
